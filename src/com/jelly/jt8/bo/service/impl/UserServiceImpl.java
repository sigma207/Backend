package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.RoleDao;
import com.jelly.jt8.bo.dao.UserDao;
import com.jelly.jt8.bo.dao.UserRoleDao;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;
import com.jelly.jt8.bo.service.UserService;
import com.jelly.jt8.bo.util.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
@Service("userService")
public class UserServiceImpl implements UserService {

    @Autowired
    @Qualifier("UserDao")
    private UserDao userDao;

    @Autowired
    @Qualifier("UserRoleDao")
    private UserRoleDao userRoleDao;


    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<User> selectUser() throws Exception {
        return userDao.selectUser();
    }

    @Override
    public List<UserRole> selectUserRole(User user) throws Exception {
        return userRoleDao.selectUserRole(user);
    }

    @Override
    public void addUser(User user) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            user.setPassword(Password.createPassword(user.getPassword()));
            userDao.insertUser(conn, user);
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }
    }

    @Override
    public void deleteUser(User user) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            userDao.deleteUser(conn, user);
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }
    }

}
