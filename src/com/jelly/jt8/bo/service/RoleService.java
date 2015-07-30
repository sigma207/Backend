package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;

import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
public interface RoleService {
    public List<Role> getRoleList() throws Exception;
    public Role addRole(Role role) throws Exception;
    public void deleteRole(Role role) throws Exception;
    public void updateRole(Role role) throws Exception;
    public void getRolePermissionList(Role role) throws Exception;
    public void allocatePermission(Role role) throws Exception;
}
