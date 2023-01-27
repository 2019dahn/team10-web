import React, { useState } from "react";
import styles from "./CommentBlock.module.scss";
import { Comment } from "../../../lib/types";
import { CommentAreaPropsType } from "./CommentArea";
import { apiPatchReply, apiDeleteReply } from "../../../lib/api";
import { timestampToDateWithDash } from "../../../lib/formatting";
import { useSessionContext } from "../../../context/SessionContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CommentPropsType = CommentAreaPropsType & {
  comment: Comment;
};

export default function CommentBlock({
  getPost,
  postId,
  category,
  comment,
}: CommentPropsType) {
  const [commentUpdating, setCommentUpdating] = useState(false);
  const [commentEditInput, setCommentEditInput] = useState(comment.content);
  const { token } = useSessionContext();

  // 댓글 수정 인풋 상자 관리
  const handleCommentEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCommentEditInput(e.target.value);
  };

  // 댓글 수정
  const editComment = (
    token: string | null,
    comment_id: number,
    content: string
  ) => {
    apiPatchReply(token, comment_id, content)
      .then((res) => {
        getPost(token, postId, category);
        setCommentEditInput(content);
        setCommentUpdating(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast("수정할 댓글 내용을 입력하세요.", {
            position: "top-center",
            theme: "colored",
          });
        }
      });
  };

  // 댓글 삭제
  const deleteComment = (token: string | null, comment_id: number) => {
    apiDeleteReply(token, comment_id)
      .then((res) => {
        getPost(token, postId, category);
      })
      .catch((err) => console.log(err));
  };

  return commentUpdating ? (
    <div key={comment.id} className={styles.commentBlockWrapper}>
      <div className={styles.commentCreaterInfo}>
        <span>
          {`${comment.created_by.username}(${comment.created_by.student_id})`}
        </span>
        <div className={styles.content}>
          {timestampToDateWithDash(Number(comment?.created_at), "date")}
          {` `}
          <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
          {` `}
          {timestampToDateWithDash(Number(comment?.created_at), "time")}
        </div>
      </div>
      <div className={styles.commentInputContainer}>
        <form>
          <input
            placeholder={"댓글 입력"}
            value={commentEditInput}
            onChange={handleCommentEditInput}
            className={styles.commentEditInput}
          />
          <div className={styles.editButtons}>
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.preventDefault();
                setCommentEditInput(comment.content);
                setCommentUpdating(false);
              }}
            >
              취소
            </button>
            <input
              type='submit'
              className={styles.editButton}
              value='완료'
              onClick={(e) => {
                e.preventDefault();
                editComment(token, comment.id, commentEditInput);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div key={comment.id} className={styles.commentBlockWrapper}>
      <div className={styles.commentCreaterInfo}>
        <span>
          {`${comment.created_by.username}(${comment.created_by.student_id})`}
        </span>
        <div className={styles.content}>
          {timestampToDateWithDash(Number(comment?.created_at), "date")}
          {` `}
          <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
          {` `}
          {timestampToDateWithDash(Number(comment?.created_at), "time")}
        </div>
        <div className={styles.commentButtons}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCommentUpdating(true);
            }}
          >
            수정
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteComment(token, comment.id);
            }}
          >
            삭제
          </button>
        </div>
      </div>
      <p>{comment.content}</p>
      <ToastContainer />
    </div>
  );
}
