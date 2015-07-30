package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Role;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
public interface RoleDao{
    public List<Role> selectRole() throws Exception;

    public int insertRole(Connection connection, Role role) throws Exception;

    public void deleteRole(Connection connection, Role role) throws Exception;

    public int updateRole(Connection connection, Role role) throws Exception;
}
