import React from 'react';
import { Button, Tag } from 'antd';



type CustomButtonType = {
    label: string;
    type?: string;
    onMainClick: () => void;
    onIconClick?: () => void;
    selected?: boolean;
    icon?: React.ReactNode;
};

export const CustomButton: React.FC<CustomButtonType> = ({
  label,
  type,
  onMainClick,
  onIconClick,
  selected = false,
  icon,
}) => {
  return (
    <div
        style={{
            display: "inline-flex",
            border: "1px solid #d9d9d9",
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
        }}
    >
        {/* 主功能按钮 */}
        <div
            style={{
                backgroundColor: selected ? '#22B14C' : '#C3C3C3',
                width: 10,
            }}
        />
        <Button
            onClick={onMainClick}
            style={{
            display: "block",
            textAlign: "left",
            border: "none",
            borderRadius: 0,
            flex: 1,
            padding: 0,
            height: 45,
            }}
        >
            <div>{label}</div>
            <div
            style={{
                color: "#999",
            }}
            >
            {type}
            </div>
        </Button>
        {/* 辅助功能按钮（带图标） */}
        <Button
            icon={icon}
            disabled = {onIconClick ? false : true}
            onClick={(e) => {
                e.stopPropagation(); // 防止触发主功能
                onIconClick?.();
            }}
            style={{
            border: "none",
            borderLeft: "1px solid #d9d9d9",
            borderRadius: 0,
            width: 40,
            height: 45,
            }}
        />
    </div>
  );
};