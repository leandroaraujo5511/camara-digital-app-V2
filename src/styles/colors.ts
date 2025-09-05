export const colors = {
  // Tons de cinza
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Tons de vermelho
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Tons de azul
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Tons de verde
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Tons de roxo
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Tons de laranja
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
};

// Tokens semânticos para usar no app
export const tokens = {
  colors: {
    primary: colors.blue[500],
    secondary: colors.purple[500],
    success: colors.green[500],
    error: colors.red[500],
    warning: colors.orange[500],
    
    // Backgrounds
    background: {
      primary: colors.slate[50],
      secondary: colors.slate[100],
      dark: colors.slate[900],
    },
    
    // Textos
    text: {
      primary: colors.slate[900],
      secondary: colors.slate[600],
      disabled: colors.slate[400],
      light: colors.slate[50],
    },

    // Estados de voto
    vote: {
      sim: colors.green[500],
      nao: colors.red[500],
      abstencao: colors.orange[500],
      ausente: colors.slate[500],
    },

    // Cores base para uso direto
    slate: colors.slate,
    red: colors.red,
    blue: colors.blue,
    green: colors.green,
    purple: colors.purple,
    orange: colors.orange,
  },
};
