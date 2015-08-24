package com.jelly.jt8.bo.model;

import javax.persistence.Id;
import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
public class Organization extends BaseModel{
    @Id
    private int organization_id;
    private String organization_code;
    private String organization_name;
    private int parent_organization_id;
    private int sequence;
    private List<Organization> children;

    public int getOrganization_id() {
        return organization_id;
    }

    public void setOrganization_id(int organization_id) {
        this.organization_id = organization_id;
    }

    public String getOrganization_code() {
        return organization_code;
    }

    public void setOrganization_code(String organization_code) {
        this.organization_code = organization_code;
    }

    public String getOrganization_name() {
        return organization_name;
    }

    public void setOrganization_name(String organization_name) {
        this.organization_name = organization_name;
    }

    public int getParent_organization_id() {
        return parent_organization_id;
    }

    public void setParent_organization_id(int parent_organization_id) {
        this.parent_organization_id = parent_organization_id;
    }

    public int getSequence() {
        return sequence;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    public List<Organization> getChildren() {
        return children;
    }

    public void setChildren(List<Organization> children) {
        this.children = children;
    }
}
