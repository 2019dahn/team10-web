import React, { createContext, useContext, useEffect, useState } from "react";
import { apiSubjects } from "../lib/api";
import { useSessionContext } from "../context/SessionContext";
import { SubjectType } from "../lib/types";

type SubjectContextType = {
  subjects: SubjectType[] | undefined;
  mySubjects: SubjectType[] | undefined;
  curSubject: number;
  handleClick: (id: number) => void;
};

const SubjectContext = createContext<SubjectContextType>(
  {} as SubjectContextType
);

//default 붙이면 prettier 이상하게 적용됨
export function SubjectProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useSessionContext();
  const [subjects, setSubjects] = useState<SubjectType[] | undefined>(
    undefined
  );
  const [curSubject, setCurSubject] = useState<number>(-1);

  const getSubjects = (token: string | null) => {
    apiSubjects(token)
      .then((res) => {
        setSubjects(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (token) getSubjects(token);
  }, [token]);

  const mySubjects = user?.classes;

  const handleClick = (id: number) => {
    setCurSubject(id);
  };

  return (
    <SubjectContext.Provider
      value={{ subjects, mySubjects, curSubject, handleClick }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export const useSubjectContext = () => useContext(SubjectContext);
