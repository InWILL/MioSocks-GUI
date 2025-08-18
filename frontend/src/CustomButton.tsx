import React from 'react';
import { Button } from 'antd';

type CustomButtonType = {
    label: string;
    onMainClick: () => void;
    onIconClick: () => void;
    selected?: boolean;
    icon?: React.ReactNode;
};

export const CustomButton: React.FC<CustomButtonType> = ({
  label,
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
            borderRadius: 5,
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
            type="text"
            onClick={onMainClick}
            style={{
            border: "none",
            borderRadius: 0,
            flex: 1,
            padding: 0,
            }}
        >
            {label}
        </Button>
        {/* 辅助功能按钮（带图标） */}
        <Button
            type="text"
            icon={icon}
            onClick={(e) => {
            e.stopPropagation(); // 防止触发主功能
            onIconClick?.();
            }}
            style={{
            border: "none",
            borderLeft: "1px solid #d9d9d9",
            borderRadius: 0,
            width: 40,
            }}
        />
    </div>
  );
};