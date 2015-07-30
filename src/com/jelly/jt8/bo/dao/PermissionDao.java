package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Permission;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
public interface PermissionDao {
    public List<Permission> selectPermission() throws Exception;

    public List<Permission> selectPermissionByParent(Permission permission) throws Exception;

    public int insertPermission(Connection connection,Permission permission) throws Exception;

    public void deletePermission(Connection connection,Permission permission) throws Exception;

    public void updatePermission(Connection connection,Permission permission) throws Exception;
}
