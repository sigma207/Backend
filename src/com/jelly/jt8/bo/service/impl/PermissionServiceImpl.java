package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.PermissionDao;
import com.jelly.jt8.bo.dao.PermissionNameDao;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.model.PermissionMoveSetting;
import com.jelly.jt8.bo.model.PermissionName;
import com.jelly.jt8.bo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by user on 2015/7/24.
 */
@Service("permissionService")
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    @Qualifier("PermissionDao")
    private PermissionDao permissionDao;

    @Autowired
    @Qualifier("PermissionNameDao")
    private PermissionNameDao permissionNameDao;

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Permission> getPermissionList() throws Exception {
        List<Permission> treePermissionList = new ArrayList<Permission>();
        Map<String, Permission> treePermissionMap = new HashMap<String, Permission>();
        List<Permission> permissionList = permissionDao.selectPermission();
        List<PermissionName> permissionNameList = permissionNameDao.selectPermissionName();
        Map<String, List<PermissionName>> nameMap = new HashMap<String, List<PermissionName>>();
        String key = null;
        List<PermissionName> temp = null;
        for (PermissionName permissionName : permissionNameList) {
            key = String.valueOf(permissionName.getPermission_id());
            temp = nameMap.get(key);
            if (temp == null) {
                temp = new ArrayList<PermissionName>();
                nameMap.put(key, temp);
            }
            temp.add(permissionName);
        }

        Map<String, String> permissionNameMap = null;
        for (Permission permission : permissionList) {
            key = String.valueOf(permission.getPermission_id());
            permissionNameMap = new HashMap<String, String>();
            temp = nameMap.get(key);
            for (PermissionName permissionName : temp) {
                permissionNameMap.put(permissionName.getLanguage(), permissionName.getName());
            }
            permission.setPermissionNameMap(permissionNameMap);
            if (permission.getParent_permission_id() == 0) {
                treePermissionList.add(permission);
                treePermissionMap.put(String.valueOf(permission.getPermission_id()), permission);
            } else {
                Permission parentPermission = treePermissionMap.get(String.valueOf(permission.getParent_permission_id()));
                List<Permission> children = parentPermission.getChildren();
                if (children == null) {
                    children = new ArrayList<Permission>();
                    parentPermission.setChildren(children);
                }
                children.add(permission);
                treePermissionMap.put(String.valueOf(permission.getPermission_id()), permission);
            }
        }
        return treePermissionList;
    }

    @Override
    public Permission addPermission(Permission permission) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            int id = permissionDao.insertPermission(conn, permission);
            permission.setPermission_id(id);
            Map<String, String> permissionNameMap = permission.getPermissionNameMap();
            Set<String> keys = permissionNameMap.keySet();
            for (String key : keys) {
                permissionNameDao.insertPermissionName(conn, new PermissionName(permission.getPermission_id(), key, permissionNameMap.get(key)));
            }
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }

        return permission;
    }

    @Override
    public Permission updatePermission(Permission permission) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            permissionDao.updatePermission(conn, permission);

            Map<String, String> permissionNameMap = permission.getPermissionNameMap();
            Set<String> keys = permissionNameMap.keySet();
            for (String key : keys) {
                permissionNameDao.updatePermissionNameByPermissionId(conn, new PermissionName(permission.getPermission_id(), key, permissionNameMap.get(key)));
            }
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }

        return permission;
    }

    @Override
    public void deletePermission(Permission permission) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);

            recursiveRemovePermission(conn, permission);
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }
    }

    private void recursiveRemovePermission(Connection conn, Permission permission) throws Exception {
        List<Permission> children = permission.getChildren();
        if (children != null) {
            for (Permission child : children) {
                recursiveRemovePermission(conn, child);
            }
        }
        permissionNameDao.deletePermissionNameByPermissionId(conn, permission.getPermission_id());
        permissionDao.deletePermission(conn, permission);
    }

    @Override
    public void movePermission(PermissionMoveSetting permissionMoveSetting) throws Exception {
        List<Permission> moveNodes = permissionMoveSetting.getMoveNodes();
        String moveType = permissionMoveSetting.getMoveType();
        String moveAction = permissionMoveSetting.getMoveAction();

        Permission targetNode = permissionMoveSetting.getTargetNode();
        Permission treeNode = permissionMoveSetting.getTreeNode();
        int sequence = 0;
        int treeIndex = 0;

        for(Permission permission:moveNodes){
            if(permission.getPermission_id()==treeNode.getPermission_id()){
                break;
            }
            treeIndex++;
        }

        Permission p = moveNodes.remove(treeIndex);

        if(moveAction.equals("moveFirst")){
            moveNodes.add(0,p);
        }else if(moveAction.equals("moveLast")){
            moveNodes.add(p);
        }else if(moveAction.equals("moveUp")){
            moveNodes.add(treeIndex-1,p);
        }else if(moveAction.equals("moveDown")){
            moveNodes.add(treeIndex+1,p);
        }

        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);

            for(Permission permission:moveNodes){
                System.out.println(permission.getPermission_code()+":"+sequence);
                permission.setSequence( sequence++);
                permissionDao.updatePermission(conn, permission);
            }
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }
    }
}
