<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';
// 导入Font Awesome组件和图标
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faFile, faSave, faArrowDown } from '@fortawesome/free-solid-svg-icons';

// 注册图标
library.add(faDownload, faFile, faSave, faArrowDown);

interface Props {
    url: string
    title: string
    description: string
    icon: string
}

const props = withDefaults(defineProps<Props>(), {
    url: '',
    title: '',
    description: '',
    icon: 'download', // 默认使用下载图标
})
</script>

<template>
    <div class="downloadcard">
        <a :href="props.url" target="_blank" download>
            <div class="icon">
                <FontAwesomeIcon :icon="props.icon" size="2x" />
            </div>
            <p class="description">{{ props.title }}<br><span>{{ props.description }}</span></p>
        </a>
    </div>
</template>

<style>
/* 卡片背景 */
.downloadcard {
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: 8px 16px;
    transition: color 0.5s, background-color 0.5s;
    margin-top: 15px;
}

/* 卡片鼠标悬停 */
.downloadcard:hover {
    background-color: #5c82ff74;
}

/* 链接样式 */
.downloadcard a {
    display: flex;
    align-items: center;
    text-decoration: none;
}

/* 图标样式 */
.downloadcard .icon {
    margin-right: 16px;
    color: var(--vp-c-primary);
}

/* 描述链接文字 */
.downloadcard .description {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    color: var(--vp-c-text-1);
    margin: 0;
    transition: color 0.5s;
}

/* 描述链接文字2 */
.downloadcard .description span {
    font-size: 14px;
}
</style>