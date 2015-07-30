package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.PermissionName;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/27.
 */
public interface PermissionNameDao {
    public List<PermissionName> selectPermissionName() throws Exception;

    public void insertPermissionName(Connection connection, PermissionName permissionName) throws Exception;

    public void deletePermissionNameByPermissionId(Connection connection, int permission_id) throws Exception;

    public void updatePermissionNameByPermissionId(Connection connection, PermissionName permissionName) throws Exception;

}
