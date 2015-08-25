package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.Organization;
import com.jelly.jt8.bo.model.Permission;

import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
public interface OrganizationService {
    List<Organization> select() throws Exception;

    Organization select(int id) throws Exception;

    List<Organization> selectWithChildren(int id) throws Exception;

    void insert(Organization organization) throws Exception;

    void delete(int id, Organization organization) throws Exception;

    void update(int id, Organization organization) throws Exception;
}
