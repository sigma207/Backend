package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.User;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
public interface UserDao {
    User login(String login_id) throws Exception;
    public List<User> selectUser() throws Exception;

    public void insertUser(Connection connection, User user) throws Exception;

    public void deleteUser(Connection connection, User user) throws Exception;

    public void updateUser(Connection connection, User user) throws Exception;
}
