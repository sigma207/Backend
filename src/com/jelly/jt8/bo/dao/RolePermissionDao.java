package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
public interface RolePermissionDao {
    public List<RolePermission> selectRolePermissionByRole(Role role) throws Exception;
    public void insertRolePermission(Connection connection, RolePermission rolePermission) throws Exception;
    public void deleteRolePermissionByRole(Connection connection, Role role) throws Exception;
}
