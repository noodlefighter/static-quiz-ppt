#!/usr/bin/env python3
"""
文件更新脚本
功能：更新指定目录所有子目录中存在的特定文件
"""
import os
import sys
import shutil
from pathlib import Path
# 需要更新的文件列表（这些文件应该与脚本在同一目录中）
FILES_TO_UPDATE = [
    "script.js",
    "index.html",
    "styles.css",
]
def update_files_in_directory(target_dir, script_dir):
    """
    更新目标目录中存在的特定文件

    Args:
        target_dir (str): 目标目录路径
        script_dir (str): 脚本所在目录路径
    """
    updated_count = 0
    skipped_count = 0

    print(f"正在扫描目录: {target_dir}")
    print(f"需要更新的文件: {FILES_TO_UPDATE}")
    print("-" * 50)

    # 遍历目标目录及其所有子目录
    for root, dirs, files in os.walk(target_dir):
        # 检查当前目录中是否存在需要更新的文件
        for file_to_update in FILES_TO_UPDATE:
            # 如果目标目录中存在这个文件
            if file_to_update in files:
                # 源文件路径（脚本目录中的文件）
                source_file = os.path.join(script_dir, file_to_update)
                # 目标文件路径（当前扫描到的目录中的文件）
                target_file = os.path.join(root, file_to_update)

                # 检查源文件是否存在
                if not os.path.exists(source_file):
                    print(f"警告: 源文件不存在 - {source_file}")
                    continue

                try:
                    # 比较文件修改时间，只更新较旧的文件
                    source_mtime = os.path.getmtime(source_file)
                    target_mtime = os.path.getmtime(target_file)

                    if source_mtime > target_mtime:
                        # 备份原文件（可选）
                        backup_file = target_file + ".bak"
                        shutil.copy2(target_file, backup_file)

                        # 复制新文件
                        shutil.copy2(source_file, target_file)

                        # 获取相对路径用于显示
                        rel_path = os.path.relpath(target_file, target_dir)
                        print(f"✓ 已更新: {rel_path}")
                        updated_count += 1
                    else:
                        # 文件已经是最新版本
                        rel_path = os.path.relpath(target_file, target_dir)
                        print(f" 无需更新: {rel_path} (已是最新)")
                        skipped_count += 1

                except Exception as e:
                    print(f"错误: 更新 {target_file} 时出错 - {str(e)}")

    print("-" * 50)
    print(f"更新完成!")
    print(f"已更新文件数: {updated_count}")
    print(f"跳过文件数: {skipped_count}")

    return updated_count
def main():
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 检查脚本所在目录中是否存在需要更新的文件
    missing_files = []
    for file_to_update in FILES_TO_UPDATE:
        file_path = os.path.join(script_dir, file_to_update)
        if not os.path.exists(file_path):
            missing_files.append(file_to_update)

    if missing_files:
        print("警告: 以下文件在脚本目录中不存在:")
        for missing_file in missing_files:
            print(f"  - {missing_file}")
        print("这些文件将无法被更新。")
        print("-" * 50)

    # 检查命令行参数
    if len(sys.argv) != 2:
        print("用法: python update_files.py <目标目录>")
        print("示例: python update_files.py /path/to/target/directory")
        print("示例: python update_files.py . (更新当前目录)")
        sys.exit(1)

    target_dir = sys.argv[1]

    # 检查目标目录是否存在
    if not os.path.exists(target_dir):
        print(f"错误: 目录不存在 - {target_dir}")
        sys.exit(1)

    if not os.path.isdir(target_dir):
        print(f"错误: 不是有效的目录 - {target_dir}")
        sys.exit(1)

    # 将相对路径转换为绝对路径
    target_dir = os.path.abspath(target_dir)

    # 确认操作
    print(f"脚本目录: {script_dir}")
    print(f"目标目录: {target_dir}")
    print("-" * 50)

    response = input("是否继续更新文件？(y/n): ").lower()
    if response not in ['y', 'yes']:
        print("操作已取消")
        sys.exit(0)

    # 执行更新
    updated_count = update_files_in_directory(target_dir, script_dir)

    if updated_count == 0:
        print("提示: 没有找到需要更新的文件")
    else:
        print(f"总计更新了 {updated_count} 个文件")
if __name__ == "__main__":
    main()
