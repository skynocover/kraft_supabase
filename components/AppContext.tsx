import React from 'react';
import * as antd from 'antd';
import { useRouter } from 'next/router';

interface AppContextProps {
  setModal: (modal: any, width?: number) => void;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const router = useRouter();

  const [language, setLanguage] = React.useState<string>('zh_TW');

  // modal
  const [modal, setmodal] = React.useState<any>(null);
  const [modalWidth, setModalWidth] = React.useState<number>(520);
  const setModal = (modal: any, width: number = 520) => {
    setModalWidth(width);
    setmodal(modal);
  };

  /////////////////////////////////////////////////////

  React.useEffect(() => {}, []);

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        setModal,
      }}
    >
      {children}

      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => setModal(null)}
          footer={null}
          closable={false}
          width={modalWidth}
        >
          {modal}
        </antd.Modal>
      )}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
