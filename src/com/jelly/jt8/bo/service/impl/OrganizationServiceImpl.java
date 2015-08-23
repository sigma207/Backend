package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.OrganizationDao;
import com.jelly.jt8.bo.model.Organization;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by user on 2015/8/22.
 */
@Service("organizationService")
public class OrganizationServiceImpl implements OrganizationService {
    @Autowired
    @Qualifier("OrganizationDao")
    private OrganizationDao organizationDao;

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Organization> select() throws Exception {
        List<Organization> treeList = new ArrayList<Organization>();
        Map<String, Organization> treeMap = new HashMap<String, Organization>();
        List<Organization> organizationList = organizationDao.select();
        String key = null;
        for(Organization organization:organizationList){
            key = String.valueOf(organization.getOrg_id());

            if (organization.getParent_org_id() == 0) {
                treeList.add(organization);
                treeMap.put(key, organization);
            } else {
                Organization parentOrganization = treeMap.get(String.valueOf(organization.getParent_org_id()));
                List<Organization> children = parentOrganization.getChildren();
                if (children == null) {
                    children = new ArrayList<Organization>();
                    parentOrganization.setChildren(children);
                }
                children.add(organization);
                treeMap.put(key, organization);
            }
        }
        return treeList;
    }

    @Override
    public void insert(Organization organization) throws Exception {
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            organizationDao.insert(conn, organization);
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
    public void delete(int id,Organization organization) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);

            recursiveDelete(conn, organization);
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

    private void recursiveDelete(Connection conn, Organization organization) throws Exception {
        List<Organization> children = organization.getChildren();
        if (children != null) {
            for (Organization child : children) {
                recursiveDelete(conn, child);
            }
        }
        organizationDao.delete(conn, organization.getOrg_id());
    }

    @Override
    public void update(int id, Organization organization) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            organizationDao.update(conn, id, organization);
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
