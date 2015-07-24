package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.Permission;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
public interface PermissionService {
    public List<Permission> getPermissionList() throws SQLException;
    public Permission addPermission(Permission permission) throws SQLException;
}
