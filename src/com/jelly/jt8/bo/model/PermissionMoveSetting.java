package com.jelly.jt8.bo.model;

import java.util.List;

/**
 * Created by user on 2015/7/27.
 */
public class PermissionMoveSetting {
    List<Permission> moveNodes;
    Permission targetNode;
    Permission treeNode;
    String moveType;
    String moveAction;

    public List<Permission> getMoveNodes() {
        return moveNodes;
    }

    public void setMoveNodes(List<Permission> moveNodes) {
        this.moveNodes = moveNodes;
    }

    public Permission getTargetNode() {
        return targetNode;
    }

    public void setTargetNode(Permission targetNode) {
        this.targetNode = targetNode;
    }

    public Permission getTreeNode() {
        return treeNode;
    }

    public void setTreeNode(Permission treeNode) {
        this.treeNode = treeNode;
    }

    public String getMoveType() {
        return moveType;
    }

    public void setMoveType(String moveType) {
        this.moveType = moveType;
    }

    public String getMoveAction() {
        return moveAction;
    }

    public void setMoveAction(String moveAction) {
        this.moveAction = moveAction;
    }
}
