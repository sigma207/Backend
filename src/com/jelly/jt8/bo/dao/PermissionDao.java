package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Permission;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
public interface PermissionDao {
    public List<Permission> selectPermission() throws SQLException;
    public List<Permission> selectPermissionByParent(Permission permission) throws SQLException;
    public int insertPermission(Permission permission) throws SQLException;
}
