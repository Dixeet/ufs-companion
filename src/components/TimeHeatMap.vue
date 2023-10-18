<template>
  <div class="c-time">
    <div class="c-time-heatmap" :style="style"></div>
    <div class="c-time-hours text-disabled">
      <div
        v-for="(hour, index) in hours"
        :key="`hour-${index}`"
        :style="hour.style"
      >
        {{ hour.time }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  time: {
    type: Object,
    required: true,
  },
});

const style = computed(() => {
  let bgStr = 'linear-gradient(90deg';
  for (const [time, value] of Object.entries(props.time)) {
    const position = Math.round((parseInt(time) / 24) * 100);
    const colorFactor = 1000;
    const colorValue = (Math.pow(colorFactor, value) - 1) / (colorFactor - 1);
    const color = 50 - 40 * colorValue;
    const saturation = 100 - 20 * colorValue;
    const opacityFactor = 5;
    const opacity = (Math.pow(opacityFactor, value) - 1) / (opacityFactor - 1);
    bgStr += `, hsla(${color}, ${saturation}%, 50%, ${opacity}) ${position}%`;
  }
  return {
    background: bgStr + ')',
  };
});

const hours = computed(() => {
  return Object.keys(props.time).map((time) => {
    const timeRounded = Math.round(parseInt(time)).toString();
    const position = Math.round((parseInt(time) / 24) * 100);
    const translate = position && position !== 100 ? '50' : position;
    return {
      style: {
        position: 'absolute',
        left: `${position}%`,
        transform: `translateX(-${translate}%)`,
      },
      time: timeRounded.length === 1 ? `0${timeRounded}h` : `${timeRounded}h`,
    };
  });
});
</script>

<style lang="scss">
.c-time {
  &-heatmap {
    height: 8px;
  }
  &-hours {
    height: 10px;
    position: relative;
    font-size: 0.6rem;
  }
}
</style>
