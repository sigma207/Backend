package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.RoleDao;
import com.jelly.jt8.bo.dao.RolePermissionDao;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.service.RoleService;
import com.jelly.jt8.bo.util.ErrorMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
@Service("roleService")
public class RoleServiceImpl implements RoleService {

    @Autowired
    @Qualifier("RoleDao")
    private RoleDao roleDao;

    @Autowired
    @Qualifier("RolePermissionDao")
    private RolePermissionDao rolePermissionDao;


    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Role> selectRole() throws Exception {
        return roleDao.selectRole();
    }

    @Override
    public List<RolePermission> selectRolePermission(int id) throws Exception {
        return rolePermissionDao.selectRolePermission(id);
    }

    @Override
    public Role addRole(Role role) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            int id = roleDao.insertRole(conn, role);
            role.setRole_id(id);
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
        return role;
    }

    @Override
    public void allocatePermission(Role role) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            roleDao.updateRole(conn, role);
            rolePermissionDao.deleteRolePermissionByRole(conn, role);
            for(RolePermission rolePermission:role.getPermissionList()){
                rolePermissionDao.insertRolePermission(conn,rolePermission);
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

    @Override
    public void deleteRole(Role role) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            rolePermissionDao.deleteRolePermissionByRole(conn, role);
            roleDao.deleteRole(conn, role);
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

    @Override
    public void updateRole(Role role) throws Exception {
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            roleDao.updateRole(conn, role);
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
