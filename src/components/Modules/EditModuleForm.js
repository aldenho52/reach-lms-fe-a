import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  currentModule,
  editModuleAction,
} from '../../state/actions/moduleActions';
import Navigation from '../Navigation';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import * as yup from 'yup';
import schema from '../../validation/ModuleSchema';
import styled from 'styled-components';

// css
import '../../styles/Form.css';
// ant design
import 'antd/dist/antd.css';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Layout from 'antd/lib/layout';
const { TextArea } = Input;
const { Header, Footer, Content } = Layout;

//styled components
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3%;
  margin-left: 10%;
`;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

const initialFormErrors = {
  modulename: '',
  moduledescription: '',
  modulecontent: '',
};

export default function EditModuleForm() {
  const moduleToEdit = useSelector(state => state.moduleReducer.edit_module);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [values, setValues] = useState(moduleToEdit);
  const [errors, setErrors] = useState(initialFormErrors);
  const [disabled, setDisabled] = useState(false);

  const setFormErrors = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch(err => setErrors({ ...errors, [name]: err.errors[0] }));
  };

  const changeValues = e => {
    const { name, value, type } = e.target;
    const valueToUse = type === 'select' ? Select : value;
    setFormErrors(name, valueToUse);
    setValues({ ...values, [e.target.name]: valueToUse });
  };

  useEffect(() => {
    schema.isValid(values).then(valid => setDisabled(!valid));
  }, [values]);

  function submitForm(e) {
    e.preventDefault();
    const newModule = {
      modulename: values.modulename,
      moduledescription: values.moduledescription,
      modulecontent: values.modulecontent,
    };
    axiosWithAuth()
      .put(
        `https://reach-team-a-be.herokuapp.com/modules/${moduleToEdit.moduleid}`,
        newModule
      )
      .then(res => {
        dispatch(editModuleAction(values));
        dispatch(currentModule(values));
        push('/module-text');
      })
      .catch(err => {
        console.log(err);
      });
  }
  // this goes back to the module-text card, which is the third iteration that we are editing

  const goBack = () => {
    push('/module-text');
  };
  // htmal updated for Form Item values
  return (
    <Layout>
      <Header>
        <Navigation />
      </Header>
      <StyledContainer>
        <Content>
          <h1 className="edit-form-h1">Edit Module</h1>
          <Form
            {...layout}
            name="basic"
            onFinish={submitForm}
            initialValues={{
              modulename: moduleToEdit.modulename,
              moduledescription: moduleToEdit.moduledescription,
              modulecontent: moduleToEdit.modulecontent,
            }}
            className="form"
          >
            <FormItem label="Module Name:" name="modulename" validateStatus>
              <Input
                id="modulename"
                name="modulename"
                value={values.modulename}
                onChange={changeValues}
              />
              <div style={{ color: 'red' }}>
                {errors.modulename ? `${errors.modulename}` : ''}
              </div>
            </FormItem>

            <FormItem label="Module Description:" name="moduledescription">
              <TextArea
                showCount
                maxLength={250}
                id="moduledescription"
                name="moduledescription"
                value={values.moduledescription}
                onChange={changeValues}
                rows={4}
              />
              <div style={{ color: 'red' }}>
                {errors.moduledescription ? `${errors.moduledescription}` : ''}
              </div>
            </FormItem>

            <FormItem label="Module Content:" name="modulecontent">
              <Input
                id="modulecontent"
                name="modulecontent"
                value={values.modulecontent}
                onChange={changeValues}
              />
              <div style={{ color: 'red' }}>
                {errors.modulecontent ? `${errors.modulecontent}` : ''}
              </div>
            </FormItem>

            <div className="button-container">
              <Button onClick={goBack} type="secondary" className="button">
                Cancel
              </Button>
              <Button
                onClick={submitForm}
                type="primary"
                disabled={disabled}
                className="button"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Content>
      </StyledContainer>
      <Footer></Footer>
    </Layout>
  );
}
