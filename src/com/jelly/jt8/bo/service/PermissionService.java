package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.model.PermissionMoveSetting;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
public interface PermissionService {
    public List<Permission> getPermissionList() throws Exception;
    public Permission addPermission(Permission permission) throws Exception;
    public void deletePermission(Permission permission) throws Exception;
    public Permission updatePermission(int id,Permission permission) throws Exception;
    public void movePermission(PermissionMoveSetting permissionMoveSetting) throws Exception;
}
