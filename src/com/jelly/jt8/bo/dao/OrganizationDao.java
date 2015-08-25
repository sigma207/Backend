package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Organization;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
public interface OrganizationDao {
    List<Organization> select() throws Exception;

    Organization select(int id) throws Exception;

    List<Organization> selectWithChildren(int id) throws Exception;

    void insert(Connection conn, Organization organization) throws Exception;

    void update(Connection conn, int id, Organization organization) throws Exception;

    void delete(Connection conn, int id) throws Exception;
}
