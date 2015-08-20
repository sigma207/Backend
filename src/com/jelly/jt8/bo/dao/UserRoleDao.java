package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
public interface UserRoleDao {
    public List<UserRole> selectUserRole(int user_id) throws Exception;
    public void insertUserRole(Connection connection, UserRole userRole) throws Exception;
    public void deleteUserRole(Connection connection, User user) throws Exception;
}
