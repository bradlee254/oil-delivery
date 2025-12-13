<template>
  <!-- Trigger Button + Display -->
  <div class="space-y-3">
    <button
      @click="openModal"
      type="button"
      class="inline-flex items-center gap-3 px-6 py-4 bg-[#0A0D57] text-white font-semibold rounded-xl hover:bg-[#0A0D57]/90 transition shadow-lg"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </svg>
      {{ props.lat ? 'Update Location' : props.label }}
    </button>

    <div v-if="formattedAddress" class="p-4 bg-green-50 border border-green-200 rounded-xl">
      <p class="text-sm font-medium text-green-800 flex items-start gap-2">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"/>
        </svg>
        <span>{{ formattedAddress }}</span>
      </p>
    </div>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[750px] flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-2xl font-bold text-[#0A0D57]">Set Business Location</h3>
          <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="px-6 pt-5">
          <div class="relative">
            <input
              ref="searchInput"
              type="text"
              placeholder="Search for your business address in Kenya..."
              class="w-1/2 pl-14 pr-6 py-5 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#0A0D57] transition-shadow shadow-sm"
            />
            <svg class="absolute left-5 top-6 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- Map -->
        <div class="flex-1 relative">
          <div ref="mapEl" id="location-picker-map" class="absolute inset-0"></div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div class="flex justify-between items-center">
            <div class="max-w-2xl">
              <p v-if="selectedAddress" class="text-lg font-semibold text-[#0A0D57]">{{ selectedAddress }}</p>
              <p v-if="selectedAddress" class="text-sm text-gray-600 mt-1">Lat: {{ selectedLat }}, Lng: {{ selectedLng }}</p>
              <p v-else class="text-gray-500 italic">Search or click on map to select location</p>
            </div>

            <div class="space-x-4">
              <button
                @click="showModal = false"
                class="px-8 py-3.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                @click="closeAndSave"
                :disabled="!selectedLat || !selectedAddress"
                class="px-10 py-3.5 bg-[#0A0D57] text-white font-bold rounded-xl hover:bg-[#0A0D57]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xl"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{
  lat?: string | null
  lng?: string | null
  formattedAddress?: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:lat', value: string): void
  (e: 'update:lng', value: string): void
  (e: 'update:formattedAddress', value: string): void
}>()

const showModal = ref(false)
const mapEl = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const selectedLat = ref(props.lat || '')
const selectedLng = ref(props.lng || '')
const selectedAddress = ref(props.formattedAddress || '')

let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null
let autocomplete: google.maps.places.Autocomplete | null = null

const defaultCenter = { lat: -1.2921, lng: 36.8219 }
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBgFK2uiRgvfKbj6Hh5q0SYTKZ58zMZ474'

// Load Google Maps script only once
const loadGoogleMapsScript = () => {
  if ((window as any).google?.maps) return

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapGlobal`
  script.async = true
  ;(window as any).initMapGlobal = () => {} // dummy
  document.head.appendChild(script)
}

const openModal = async () => {
  showModal.value = true
  loadGoogleMapsScript()

  await nextTick()
  setTimeout(() => {
    initMap()
    initAutocomplete()
    searchInput.value?.focus()
  }, 300)
}

const closeAndSave = () => {
  emit('update:lat', selectedLat.value)
  emit('update:lng', selectedLng.value)
  emit('update:formattedAddress', selectedAddress.value)
  showModal.value = false
}

const initMap = () => {
  if (!mapEl.value || !(window as any).google?.maps) return

  const center = props.lat && props.lng
    ? { lat: parseFloat(props.lat), lng: parseFloat(props.lng) }
    : defaultCenter

  map = new google.maps.Map(mapEl.value, {
    center,
    zoom: props.lat && props.lng ? 18 : 12,
    clickableIcons: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  })

  if (props.lat && props.lng) {
    placeMarker({ lat: parseFloat(props.lat), lng: parseFloat(props.lng) })
  }

  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (e.latLng) geocodeLatLng(e.latLng)
  })
}

const initAutocomplete = () => {
  if (!(window as any).google?.maps?.places || !searchInput.value) return

  autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'ke' },
    fields: ['formatted_address', 'geometry', 'name'],
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete!.getPlace()
    if (!place.geometry?.location) return

    const location = place.geometry.location!
    const newLat = location.lat().toFixed(8)
    const newLng = location.lng().toFixed(8)

    selectedLat.value = newLat
    selectedLng.value = newLng
    selectedAddress.value = place.formatted_address || place.name || 'Unknown Address'

    map!.setCenter(location)
    map!.setZoom(18)
    placeMarker(location)
  })
}

const geocodeLatLng = (latLng: google.maps.LatLng) => {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === 'OK' && results?.[0]) {
      selectedLat.value = latLng.lat().toFixed(8)
      selectedLng.value = latLng.lng().toFixed(8)
      selectedAddress.value = results[0].formatted_address
      placeMarker(latLng)
    } else {
      selectedAddress.value = 'Address not found'
    }
  })
}

const placeMarker = (position: google.maps.LatLng | google.maps.LatLngLiteral) => {
  if (marker) marker.setMap(null)

  marker = new google.maps.Marker({
    position,
    map: map!,
    draggable: true,
    animation: google.maps.Animation.DROP,
  })

  marker.addListener('dragend', () => {
    const pos = marker!.getPosition()
    if (pos) geocodeLatLng(pos)
  })
}

// React to prop changes (e.g. when parent resets location)
watch(() => [props.lat, props.lng, props.formattedAddress], ([newLat, newLng, newAddr]) => {
  selectedLat.value = newLat || ''
  selectedLng.value = newLng || ''
  selectedAddress.value = newAddr || ''
})

// Load script on component mount (in case modal opens later)
onMounted(() => {
  loadGoogleMapsScript()
})
</script>

<style scoped>
/* You can keep your Tailwind classes as-is since they're used via class attribute */
</style>