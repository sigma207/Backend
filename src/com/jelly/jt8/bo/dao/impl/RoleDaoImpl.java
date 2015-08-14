package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.RoleDao;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.util.ErrorMsg;
import com.jelly.jt8.bo.util.RsMapper;
import com.jelly.jt8.common.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
@Repository("RoleDao")
public class RoleDaoImpl extends BaseDao implements RoleDao{
    private final static String QUERY = "SELECT role_id, parent_role_id, role_code, role_name, update_time, rv FROM bo_role ";
    private final static String INSERT = "INSERT INTO bo_role (parent_role_id, role_code, role_name, update_time) VALUES (?, ?, ?, ?);";
    private final static String UPDATE = "UPDATE bo_role SET role_code = ?,role_name = ?,update_time = ? WHERE role_id = ? AND rv = ? ";
    private final static String DELETE = "DELETE bo_role WHERE role_id = ? AND rv = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Role> selectRole() throws Exception {
        List<Role> list = new LinkedList<Role>();
        execute(jt8Ds.getConnection(),QUERY,list,Role.class);
        return list;
    }

    @Override
    public int insertRole(Connection connection, Role role) throws Exception {
        PreparedStatement stmt = null;
        int lastKey = -1;
        try {

            stmt = connection.prepareStatement(INSERT, Statement.RETURN_GENERATED_KEYS);
            stmt.setNull(1, Types.INTEGER);
            stmt.setString(2, role.getRole_code());
            stmt.setString(3, role.getRole_name());
            stmt.setString(4, Utils.updateTime());
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();

            if (keys.next()) {
                lastKey = keys.getInt(1);
            }
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return lastKey;
    }

    @Override
    public void deleteRole(Connection connection, Role role) throws Exception {
        PreparedStatement stmt = null;
        int updateCount = 0;
        try {
            stmt = connection.prepareStatement(DELETE);

            stmt.setInt(1, role.getRole_id());
            stmt.setBytes(2, role.getRv());
            updateCount =stmt.executeUpdate();
            if(updateCount==0){
                throw new Exception(ErrorMsg.DIRTY_DATA);
            }
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void updateRole(Connection connection, Role role) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(UPDATE);

            stmt.setString(1, role.getRole_code());
            stmt.setString(2, role.getRole_name());
            stmt.setString(3, Utils.updateTime());
            stmt.setInt(4, role.getRole_id());
            stmt.setBytes(5, role.getRv());
            int updateCount =stmt.executeUpdate();
            if(updateCount==0){
                throw new Exception(ErrorMsg.DIRTY_DATA);
            }
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
