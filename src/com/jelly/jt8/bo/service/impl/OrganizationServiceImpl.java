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
import java.util.*;

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
        List<Organization> organizationList = organizationDao.select();
        return group(organizationList);
    }

    @Override
    public Organization select(int id) throws Exception {
        return organizationDao.select(id);
    }

    @Override
    public List<Organization> selectWithChildren(int id) throws Exception {
        List<Organization> organizationList = organizationDao.selectWithChildren(id);
        return group(organizationList);
    }

    private List<Organization> group(List<Organization> organizationList) throws Exception{
        List<Organization> treeList = new ArrayList<Organization>();
        Map<String, List<Organization>> groupMap = new HashMap<String,List<Organization>>();
        Set<Integer> keySet = new HashSet<Integer>();
        List<Organization> children = null;
        String key = null;
        String parentKey = null;
        for(Organization organization:organizationList){
            parentKey = String.valueOf(organization.getParent_organization_id());
            children = groupMap.get(parentKey);
            if(children==null){
                children = new ArrayList<Organization>();
                groupMap.put(parentKey,children);
            }
            children.add(organization);
            keySet.add(organization.getOrganization_id());
        }
        Set<String> treeSet = new HashSet<String>();
        for(Organization organization:organizationList){
            key = String.valueOf(organization.getOrganization_id());
            children = groupMap.get(key);
            if(children!=null ){
                if(!keySet.contains(organization.getParent_organization_id())) {
                    treeList.add(organization);
                }
                organization.setChildren(children);
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
        organizationDao.delete(conn, organization.getOrganization_id());
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
