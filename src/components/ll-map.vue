<template lang="html">

  <div :class="mapClasses">
    <div class="overlay">
      <i class="fa fa-spinner fa-spin fa-fw fa-2x"></i>
    </div>
    <l-map style="height: 380px" :zoom="zoom" :center="center" :bounds="bounds">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

      <marker-popup v-for="(marker, index) in markers" :marker="marker" :key="index"></marker-popup>
    </l-map>
  </div>

</template>

<script>
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
  import MarkerPopup from './ll-marker-popup';

  export default {
    name: 'll-map',

    components: {
      LMap,
      LTileLayer,
      MarkerPopup
    },

    props: ['markers', 'classes'],

    computed: {
      mapClasses() {
        return this.classes + ' map-container'
      }
    },

    data () {
      return {
        bounds: L.latLngBounds(
          { lat: -13.341123466494878, lng: -44.221515655517585 },
          { lat: -11.30192133529738, lng: -36.338825225830085 }
        ),
        zoom: 9,
        center: L.latLng(-5.968951, -36.254105),
        url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }
    },

    watch: {
      'bounds': {
        handler: function(newVal, oldVal) {
          this.$emit('boundsChanged', newVal)
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">

.overlay {
  .fa {
    display: none;
  }
}

.loading-map,
.map-container {
  position: relative;
}

.leaflet-dragging {
  .overlay {
    height: 100%;
    width: 100%;
    z-index: 2000;
    position: absolute;
    background-color: rgba(47, 47, 47, 0.6);
    text-align: center;
    line-height: 380px;

    .fa {
      display: inline-block;
      color: $white;
    }
  }
}

.loading-map {
  .overlay {
    height: 100%;
    width: 100%;
    z-index: 10000;
    position: absolute;
    background-color: rgba(47, 47, 47, 0.6);
    text-align: center;
    line-height: 380px;

    .fa {
      display: inline-block;
      color: $white;
    }
  }
}

</style>

<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";
</style>
