package com.jelly.access.pojo.user;

import com.jelly.access.pojo.privilege.Privilege;
import com.jelly.access.pojo.role.Role;

import java.util.List;

/**
 * Created by user on 2015/7/6.
 */
public class User {
    int id;
    String name;
    String account;
    String password;
    List<Role> roleList;
    List<Privilege> extraPrivilegeList;
    List<Privilege> privilegeList;
}
