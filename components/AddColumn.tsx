import React, { useContext } from 'react';

import { useRouter } from 'next/router';
import * as antd from 'antd';

import { supabase } from '../utils/supabaseClient';

import { AppContext } from './AppContext';

export const AddColumn = ({ onSuccess }: { onSuccess: any }) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const onFinish = async (values: any) => {
    const updates = {
      name: values.name,
      typeId: '',
      tableId: 1,
    };

    let { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    });

    if (error) {
      throw error;
    }
    appCtx.setModal(null);
  };

  return (
    <antd.Form onFinish={onFinish}>
      <antd.Form.Item
        label="column"
        name="column"
        rules={[{ required: true, message: 'Please input column name' }]}
      ></antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button htmlType="submit" type="primary">
          新增
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
