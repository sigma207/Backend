package com.jelly.jt8.bo.model;

/**
 * Created by user on 2015/7/30.
 */
public class UserRole {
    private String login_id;
    private int role_id;

    public UserRole(String login_id, int role_id) {
        this.login_id = login_id;
        this.role_id = role_id;
    }

    public String getLogin_id() {
        return login_id;
    }

    public void setLogin_id(String login_id) {
        this.login_id = login_id;
    }

    public int getRole_id() {
        return role_id;
    }

    public void setRole_id(int role_id) {
        this.role_id = role_id;
    }
}
