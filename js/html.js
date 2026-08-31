import htm from "../vendor/htm.module.js";

export const React = window.React;
export const html = htm.bind(React.createElement);
export const { useState, useEffect, useRef, useMemo, useCallback } = React;
