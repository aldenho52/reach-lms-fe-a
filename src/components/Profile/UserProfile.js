import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
//ant d
import 'antd/dist/antd.css';
import { Card } from 'antd';
import { Button } from 'antd';
import { Layout } from 'antd';
import { Avatar, Image } from 'antd';

const StyledLogo = styled.h1`
  position: relative;
  font-size: 4vw;
  color: #252839;
  -webkit-text-stroke: 0.3vw #383d52;
  text-transform: uppercase;
  &::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #01fe87;
    -webkit-text-stroke: 0vw #383d52;
    border-right: 2px solid #01fe87;
    overflow: hidden;
    animation: animate 6s linear infinite;
  }
  @keyframes animate {
    0%,
    10%,
    100% {
      width: 0%;
    }
    70%,
    90% {
      width: 100%;
    }
  }
`;

const StyledAvatar = styled.div`
  margin-left: 95%;
  margin-top: 4%;
`;

export default function UserProfile() {
  const user = useSelector(state => state.userReducer);
  const { push } = useHistory();
  const { Header, Footer, Sider, Content } = Layout;

  function clickOnEdit(e) {
    e.preventDefault();
    push('/edit-profile');
  }

  function returnHome(e) {
    e.preventDefault();
    push('/');
  }

  return (
    <Layout>
      <Sider>
        <StyledAvatar>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            src={
              <Image src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            size={50}
          />
        </StyledAvatar>
      </Sider>
      <Layout>
        <Header>
          <StyledLogo data-text="Profile...">Profile...</StyledLogo>
        </Header>
        <Content>
          <Card
            title={user.firstname + ' ' + user.lastname}
            style={{ width: 800 }}
          >
            <h3>Role: {user.role}</h3>
            <p>Phone: {user.phonenumber}</p>
            <p>Email: {user.email}</p>
            <Button type="primary" onClick={e => clickOnEdit(e)}>
              Edit Profile
            </Button>
          </Card>
          <Button type="primary" onClick={e => returnHome(e)}>
            Home
          </Button>
        </Content>
        <Footer></Footer>
      </Layout>
    </Layout>
  );
}
