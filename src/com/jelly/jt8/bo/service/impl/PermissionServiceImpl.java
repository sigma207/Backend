package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.PermissionDao;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
@Service("permissionService")
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    @Qualifier("PermissionDao")
    private PermissionDao permissionDao;

    @Override
    public List<Permission> getPermissionList() throws SQLException {
        return permissionDao.selectPermission();
    }

    @Override
    public Permission addPermission(Permission permission) throws SQLException {
//        List<Permission> permissionList = permissionDao.selectPermissionByParent(parentPermission);
//        permission.setSequence(permissionList.size()+1);
        int id = permissionDao.insertPermission(permission);
        permission.setPermission_id(id);
        return permission;
    }
}
