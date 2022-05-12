import * as antd from 'antd';
import { useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AppContext } from './AppContext';
import { AddColumn } from './AddColumn';

export const Table = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const appCtx = useContext(AppContext);

  useEffect(() => {
    getData();
    // console.log('get profile');
  }, [session]);

  const getData = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        setLoading(false);
        return;
      }
      let columns: any = {};
      {
        let { data, error, status } = await supabase.from('columns').select(`*`);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          const temp = data.map((item) => {
            columns[item.name] = '';
            return { title: item.name, dataIndex: item.name, key: item.name, align: 'center' };
          });
          setColumns(temp);
        }
      }
      let tempRows = [];
      {
        let { data, error, status } = await supabase.from('rows').select(`*`);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          console.log({ rows: data });
          tempRows = data.map((item) => item.id);
        }
      }
      let tempDatas = tempRows.map((item) => {
        return { key: item, ...columns };
      });
      console.log({ tempDatas });
      {
        let { data, error, status } = await supabase.from('row_value').select(`*,columnId(*)`);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          data.map((item) => {
            tempDatas[item.rowId - 1][item.columnId.name] = item.value.value;
          });
          // console.log({ row_value: data });
        }
      }
      console.log({ tempDatas });
      setDataSource(tempDatas);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [columnModalVisible, setColumnModalVisible] = useState(false);
  const [addColumnName, setAddColumnName] = useState<string | null>(null);

  const handleOk = async () => {
    const user = supabase.auth.user();
    console.log({ user });
    console.log(addColumnName);
    if (addColumnName) {
      let { error } = await supabase.from('columns').upsert(
        {
          name: addColumnName,
          typeId: 1,
          tableId: 1,
        },
        {
          returning: 'minimal', // Don't return the value after inserting
        },
      );
      console.log({ error });
      await getData();
    }

    setColumnModalVisible(false);
  };

  return (
    <div>
      <div className="flex justify-end">
        <antd.Button onClick={() => setColumnModalVisible(true)}>Add Column</antd.Button>
        <antd.Button onClick={() => appCtx.setModal(<AddColumn onSuccess={getData} />)}>
          Add Row
        </antd.Button>
      </div>
      <antd.Table columns={columns} dataSource={dataSource} />
      <antd.Modal
        title="Basic Modal"
        visible={columnModalVisible}
        onOk={handleOk}
        onCancel={() => setColumnModalVisible(false)}
      >
        <antd.Input
          placeholder="Please input column name"
          onChange={(v) => setAddColumnName(v.target.value)}
        />
      </antd.Modal>
    </div>
  );
};
