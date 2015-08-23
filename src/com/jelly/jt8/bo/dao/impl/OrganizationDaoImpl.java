package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.OrganizationDao;
import com.jelly.jt8.bo.model.Organization;
import com.jelly.jt8.bo.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
@Repository("OrganizationDao")
public class OrganizationDaoImpl extends BaseDao implements OrganizationDao {
    private final static String QUERY = "SELECT org_id, org_code, org_name, parent_org_id, sequence FROM bo_org ";
    private final static String INSERT = "INSERT INTO bo_org (org_code, org_name, parent_org_id, sequence) VALUES (?, ?, ?, ?);";
    private final static String DELETE = "DELETE bo_org WHERE org_id = ? ";
    private final static String UPDATE = "UPDATE bo_org SET org_code = ?, org_name = ?, sequence = ? WHERE org_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Organization> select() throws Exception {
        List<Organization> list =  new LinkedList<Organization>();
        execute(jt8Ds.getConnection(),QUERY,list,Organization.class);
        return list;
    }

    @Override
    public void insert(Connection conn, Organization organization) throws Exception {
        PreparedStatement stmt = null;
        int lastKey = -1;
        try {
            stmt = conn.prepareStatement(INSERT,Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, organization.getOrg_code());
            stmt.setString(2, organization.getOrg_name());
            if(organization.getParent_org_id()==0){
                stmt.setNull(3, Types.INTEGER);
            }else{
                stmt.setInt(3, organization.getParent_org_id());
            }

            stmt.setInt(4, organization.getSequence());
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();

            if (keys.next()) {
                lastKey = keys.getInt(1);
            }
            organization.setOrg_id(lastKey);
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
    public void update(Connection conn, int id, Organization organization) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = conn.prepareStatement(UPDATE);

            stmt.setString(1, organization.getOrg_code());
            stmt.setString(2, organization.getOrg_name());
            stmt.setInt(3, organization.getSequence());
            stmt.setInt(4, id);

            stmt.executeUpdate();
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
    public void delete(Connection conn, int id) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = conn.prepareStatement(DELETE);

            stmt.setInt(1, id);
            stmt.executeUpdate();
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
