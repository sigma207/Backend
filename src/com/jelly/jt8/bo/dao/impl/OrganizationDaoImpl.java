package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.OrganizationDao;
import com.jelly.jt8.bo.model.Organization;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.util.RsMapper;
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
    private final static String QUERY = "SELECT organization_id, organization_code, organization_name, parent_organization_id, sequence FROM bo_organization ";
    private final static String INSERT = "INSERT INTO bo_organization (organization_code, organization_name, parent_organization_id, sequence) VALUES (?, ?, ?, ?);";
    private final static String DELETE = "DELETE bo_organization WHERE organization_id = ? ";
    private final static String UPDATE = "UPDATE bo_organization SET organization_code = ?, organization_name = ?, sequence = ? WHERE organization_id = ? ";
    private final static String WHERE_ID = " WHERE organization_id = ? ";
    private final static String QUERY_WITH_CHILDREN = "WITH my_organization as\n" +
            "(\n" +
            "  SELECT *\n" +
            "  FROM bo_organization o\n" +
            "  WHERE organization_id = ? \n" +
            "\n" +
            "  UNION ALL\n" +
            "\n" +
            "  SELECT o1.*\n" +
            "  FROM bo_organization o1  \n" +
            "  INNER JOIN my_organization M\n" +
            "  ON M.organization_id = o1.parent_organization_id\n" +
            " )\n" +
            "SELECT organization_id, organization_code, organization_name, parent_organization_id, sequence From my_organization ";

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
    public Organization select(int id) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Organization> list = new LinkedList<Organization>();
        Organization organization = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY+WHERE_ID);
            stmt.setInt(1, id);

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, Organization.class);
            if(list.size()>0){
                organization = list.get(0);
            }
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return organization;
    }

    @Override
    public List<Organization> selectWithChildren(int id) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Organization> list = new LinkedList<Organization>();
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY_WITH_CHILDREN);
            stmt.setInt(1, id);

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, Organization.class);
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    @Override
    public void insert(Connection conn, Organization organization) throws Exception {
        PreparedStatement stmt = null;
        int lastKey = -1;
        try {
            stmt = conn.prepareStatement(INSERT,Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, organization.getOrganization_code());
            stmt.setString(2, organization.getOrganization_name());
            if(organization.getParent_organization_id()==0){
                stmt.setNull(3, Types.INTEGER);
            }else{
                stmt.setInt(3, organization.getParent_organization_id());
            }

            stmt.setInt(4, organization.getSequence());
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();

            if (keys.next()) {
                lastKey = keys.getInt(1);
            }
            organization.setOrganization_id(lastKey);
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

            stmt.setString(1, organization.getOrganization_code());
            stmt.setString(2, organization.getOrganization_name());
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
