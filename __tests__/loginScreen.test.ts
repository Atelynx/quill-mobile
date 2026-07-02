import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';

const mockLogin = jest.fn();
const mockRegister = jest.fn();

jest.mock('../src/state/AppSessionContext', () => ({
  useAppSession: () => ({
    lastEmail: 'ultimo@quill.cl',
    login: mockLogin,
    mode: 'backend',
    register: mockRegister,
  }),
}));

jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: '#ffffff',
      border: '#dddddd',
      danger: '#bb0000',
      mode: 'light',
      muted: '#666666',
      primary: '#0055cc',
      surface: '#ffffff',
      surfaceMuted: '#eeeeee',
      success: '#008800',
      text: '#111111',
    },
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockLogin.mockReset().mockResolvedValue(undefined);
    mockRegister.mockReset().mockResolvedValue({ message: 'Cuenta creada.' });
  });

  it('prellena solo el último correo y deja contraseña vacía', () => {
    render(createElement(LoginScreen));

    expect(screen.getByPlaceholderText('Correo').props.value).toBe('ultimo@quill.cl');
    expect(screen.getByPlaceholderText('Contraseña').props.value).toBe('');
  });

  it('no usa credenciales demo por defecto', () => {
    render(createElement(LoginScreen));

    expect(screen.getByPlaceholderText('Correo').props.value).not.toBe('demo@quill.local');
    expect(screen.getByPlaceholderText('Contraseña').props.value).not.toBe('Demo123456!');
  });

  it('exige ingreso manual de contraseña antes de login', () => {
    render(createElement(LoginScreen));

    const [, submitButton] = screen.getAllByText('Entrar');
    fireEvent.press(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByText('Ingresa correo y contraseña.')).toBeTruthy();
  });
});
