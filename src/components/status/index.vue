<template>
  <i class="status" :class="isDisabled ? 'status-disable' : 'status-enable'" />
</template>

<script>
export default {
  name: "index",
  props: {
    isDisabled: Boolean
  }
};
</script>

<style scoped lang="scss">
.status {
  width: 10px;
  height: 10px;
  border-radius: 5px;

  &-disable {
    background-color: #ff6b6b;
  }

  &-enable {
    background-color: #51cf66;
  }
}
</style>
