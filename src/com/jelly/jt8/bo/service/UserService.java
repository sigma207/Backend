package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;

import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
public interface UserService {
    public List<User> selectUser() throws Exception;

    public List<UserRole> selectUserRole(int user_id) throws Exception;

    public void insertUser(User user) throws Exception;

    public void deleteUser(User user) throws Exception;

    public void allocateUserRole(User user) throws Exception;
}


