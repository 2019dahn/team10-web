import React, { useState, useEffect } from "react";
import styles from "./BoardDetail.module.scss";
import { Link, useLocation } from "react-router-dom";
import { PostDetail } from "../../../lib/types";
import { apiPost } from "../../../lib/api";
import { timestampToDateWithDash } from "../../../lib/formatting";
import { useSessionContext } from "../../../context/SessionContext";
import { useSubjectContext } from "../../../context/SubjectContext";
import { boardIdentifier } from "../../../lib/formatting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export default function BoardDetail() {
  const location = useLocation();
  const category = location.pathname.split("/")[2];
  const postId = Number(location.pathname.split("/")[3]);
  const { token } = useSessionContext();
  const { curSubject } = useSubjectContext();
  const [reply, setReply] = useState("");
  const [post, setPost] = useState<PostDetail>();

  const getPost = (token: string | null, post_id: number, category: string) => {
    apiPost(token, post_id, category)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    curSubject && getPost(token, postId, category);
  }, []);

  const handleInputReply = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //fetch 함수부분
    setReply("");
  };

  //useEffect로 호출하기?

  return (
    <div className={styles.wrapper}>
      <form onSubmit={onSubmit}>
        <header>
          <h2>{boardIdentifier(category)} 게시판</h2>
          <Link to={`/${curSubject?.name}/${category}`}>
            <button className={styles.listButton}>목록</button>
          </Link>
        </header>
        <section>
          <h2>{post?.title}</h2>
          <div className={styles.explainContainer}>
            <div className={styles.flex}>
              <div className={styles.contentName}>작성자:</div>
              <div className={styles.content}>{post?.created_by.username}</div>
              <div className={styles.contentName}>등록일시:</div>
              <div className={styles.content}>
                {timestampToDateWithDash(Number(post?.created_at), "date")}
                {` `}
                <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                {` `}

                {timestampToDateWithDash(Number(post?.created_at), "time")}
              </div>
            </div>
            <div className={styles.flex}>
              <div className={styles.contentName}>조회수:</div>
              <div className={styles.content}>조회수</div>
            </div>
          </div>
          <article>{post?.content}</article>
          <div className={styles.previousContainer}>
            <div className={styles.previousTitle}>이전글</div>
            <div className={styles.previous}>어쩌구 저쩌구</div>
          </div>
        </section>
        <footer>
          <h3>댓글</h3>
          <textarea
            placeholder={"댓글입력"}
            onChange={handleInputReply}
          ></textarea>
          <button className={styles.commentButton}>댓글등록</button>
        </footer>
      </form>
    </div>
  );
}
