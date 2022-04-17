<template>
  <span class="json-node">
    <template
      v-if="showKey && jsonKey != null"
    >
      <span class="json-key">  {{ JSON.stringify(jsonKey) }} </span>
      <span class="json-colon"> : </span>
    </template>

    <template v-if="isBaseValue">
      <span
        v-if="isJsonString"
        class="action-button type-json-string"
        :class="{
          'type-json-string-close':jsonStringObject !== null,
          'type-json-string-open':jsonStringObject === null,
        }"
        @click="openNewObject"
      />
      <span
        class="json-base-value"
        :class="{'type-bool':type === 'boolean',
                 'type-null':type === 'null',
                 'type-number':type === 'number',
                 'type-string':type === 'string'}"
      >
        {{ JSON.stringify(jsonValue) }}
      </span>
      <span
        v-if="!isLastItem"
      > ,</span>
    </template>

    <template
      v-else
    >
      <span
        v-if="isArray"
      >[</span>
      <span
        v-else
      >{</span>
      <span
        class="action-button"
        :class="{
          'json-subnode-close':showSubNode,
          'json-subnode-open':!showSubNode
        }"
        @click="showSubNode = !showSubNode"
      />
      <span
        class="json-subnode-item-count"
        :data-array-length="`${jsonValueKeys.length} items`"
      />
      <span
        v-show="!showSubNode"
      >...&nbsp;&nbsp;
        <span v-if="isArray">]</span>
        <span v-else>}</span>
        <span
          v-if="!isLastItem"
        > ,</span>
      </span>
      <CollapseItemVue :duration="0.3">
        <span
          v-show="showSubNode"
          class="json-child-list"
        >
          <span
            v-for="(key,index) in jsonValueKeys"
            :key="key"
            class="json-child-item"
          >
            <JsonNode
              :json-key="key"
              :json-value="jsonValue[key]"
              :show-key="!isArray"
              :is-last-item="(jsonValueKeys.length > 0 && index == jsonValueKeys.length - 1)"
            />
          </span>
        </span>
      </CollapseItemVue>
      <template
        v-if="showSubNode "
      >
        <span v-if="isArray">]</span>
        <span v-else>}</span>
        <span
          v-if="!isLastItem"
        > ,</span>
      </template>
    </template>

    <CollapseItemVue :duration="0.3">
      <div
        v-if="jsonStringObject"
        class="json-string-object-node"
      >
        <div>
          <span
            v-if="isJsonString"
            class="action-button type-json-string"
            :class="{
              'type-json-string-close':jsonStringObject !== null,
              'type-json-string-open':jsonStringObject === null,
            }"
            @click="openNewObject"
          />
        </div>
        <JsonNode
          :json-value="jsonStringObject"
        />
      </div>

    </CollapseItemVue>

  </span>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import getTypeOf, { JsonValueType } from '../utils/typeof';
import CollapseItemVue from './CollapseItem.vue';

class Props {
  jsonKey = prop({ type: [Object, String, Number], default: null });

  jsonValue = prop({ type: [Object, String, Number, Array, Date, Boolean], default: undefined });

  showKey = prop({ type: Boolean, default: true });

  isLastItem = prop({ type: Boolean, default: true });
}

@Options({
  components: {
    CollapseItemVue,
  },
  watch: {
    jsonValue() {
      this.updateKeysAndType();
    },
  },
})
export default class JsonNode extends Vue.with(Props) {
  type = JsonValueType.null;

  jsonValueKeys:string[] = [];

  showSubNode = true;

  jsonStringObject:unknown | null = null;

  mounted() {
    this.updateKeysAndType();
  }

  updateKeysAndType() {
    if (this.jsonValue !== undefined) {
      this.type = getTypeOf(this.jsonValue);
      this.jsonValueKeys = Object.keys(this.jsonValue);
    } else {
      this.type = JsonValueType.null;
      this.jsonValueKeys = [];
    }
  }

  openNewObject() {
    if (this.jsonStringObject) {
      this.jsonStringObject = null;
    } else {
      this.jsonStringObject = JSON.parse(this.jsonValue);
    }
  }

  get isArray():boolean {
    return this.type === JsonValueType.array;
  }

  get isObject():boolean {
    return this.type === JsonValueType.object;
  }

  get isBaseValue():boolean {
    return !(this.isArray || this.isObject);
  }

  get isJsonString():boolean {
    if (this.type !== JsonValueType.string) {
      return false;
    }
    try {
      const obj = JSON.parse(this.jsonValue);
      if (obj) {
        const type = getTypeOf(obj);
        return type === JsonValueType.array || type === JsonValueType.object;
      }
      return false;
    } catch {
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.action-button {
  &::before {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    width: 25px;
    height: 25px;
    margin: 0 0 0 10px;
    border-radius: 17.5px;
    background-color: #ebebeb;
    box-shadow: rgba(0, 0, 0, 0.231) 2px 2px 3px ;
    cursor: pointer;
  }
}

.json-subnode-item-count {
  &::after {
    display: inline-flex;
    content: attr(data-array-length);
    justify-content: center;
    align-items: center;
    height: 20px;
    color: rgb(195, 195, 195);
    font-size: 0.8rem;
    margin: 0 5px;
  }

}
.json-subnode-open{
  &::before {
    content: "+";
  }
}
.json-subnode-close{
  &::before {
    content: "-";
  }
}
.json-child-list {
  display: block;
  padding-left: 2em;
  border-left: 1px dotted rgba(0, 0, 0, 0.158);
  .json-child-item {
    display: block;
  }
}

.json-key {
  color: purple;
}

.json-node {
  font-weight: bold;
}
.type-string {
  color: #0DBC79;
}
.type-number {
  color: #29B8DB;
}

.type-null {
  color: #D19A66;
}
.type-bool {
  color: #C678DD;
}
.type-json-string {
  &::before {
      content: '+';
      transition: transform 0.3s linear,background-color 0.3s linear,;
      margin-right: 10px;
      color: white;
  }
}
.type-json-string-close {
    &::before {
      transform: rotate(45deg);
      background-color: #dc544a;
    }
}
.type-json-string-open {
    &::before {
      transform: rotate(0deg);
      background-color: #29B8DB;
    }
}
.json-base-value {
  position: relative;
}

.json-string-object-node {
  position: relative;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, .3) inset;
  padding: 0 1rem;
  margin: 0 1rem 0rem 1rem ;
  background-color: white;
}

</style>
