package com.jelly.jt8.bo.model;

import javax.persistence.Id;
import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
public class Organization extends BaseModel{
    @Id
    private int org_id;
    private String org_code;
    private String org_name;
    private int parent_org_id;
    private int sequence;
    private List<Organization> children;

    public int getOrg_id() {
        return org_id;
    }

    public void setOrg_id(int org_id) {
        this.org_id = org_id;
    }

    public String getOrg_code() {
        return org_code;
    }

    public void setOrg_code(String org_code) {
        this.org_code = org_code;
    }

    public String getOrg_name() {
        return org_name;
    }

    public void setOrg_name(String org_name) {
        this.org_name = org_name;
    }

    public int getParent_org_id() {
        return parent_org_id;
    }

    public void setParent_org_id(int parent_org_id) {
        this.parent_org_id = parent_org_id;
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
