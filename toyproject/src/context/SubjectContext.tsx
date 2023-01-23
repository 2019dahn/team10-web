import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiSubjects } from '../lib/api';
import { useSessionContext } from '../context/SessionContext';
import { SubjectType } from '../lib/types';

type SubjectContextType = {
  subjects: SubjectType[] | undefined;
  mySubjects: SubjectType[] | undefined;
  curSubject: SubjectType | undefined;
  handleClick: (subject: SubjectType) => void;
  getSubjects: (token: string | null) => void;
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
  const [curSubject, setCurSubject] = useState<SubjectType | undefined>(
    undefined
  );

  const getSubjects = async (token: string | null) => {
    try {
      const res = await apiSubjects(token);
      setSubjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) getSubjects(token);
  }, [token]);

  const mySubjects = user?.classes;

  const handleClick = (subject: SubjectType) => {
    setCurSubject(subject);
  };

  const enrollClass = () => {};

  const dropClass = () => {};

  return (
    <SubjectContext.Provider
      value={{ subjects, mySubjects, curSubject, handleClick, getSubjects }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export const useSubjectContext = () => useContext(SubjectContext);
