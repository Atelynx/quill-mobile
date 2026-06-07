import { validateRegisterInput } from '../src/services/registerValidation';

describe('validateRegisterInput', () => {
  it('acepta fullName, email y password válidos', () => {
    const result = validateRegisterInput({
      fullName: 'Usuario Demo',
      email: 'DEMO@QUILL.LOCAL',
      password: 'Demo123456!',
    });

    expect(result).toEqual({
      success: true,
      data: {
        fullName: 'Usuario Demo',
        email: 'demo@quill.local',
        password: 'Demo123456!',
      },
    });
  });

  it('acepta username opcional y lo normaliza', () => {
    const result = validateRegisterInput({
      fullName: 'Usuario Demo',
      email: 'demo@quill.local',
      password: 'Demo123456!',
      username: 'Usuario_Demo',
    });

    expect(result).toEqual({
      success: true,
      data: {
        fullName: 'Usuario Demo',
        email: 'demo@quill.local',
        password: 'Demo123456!',
        username: 'usuario_demo',
      },
    });
  });

  it('rechaza username con caracteres no permitidos', () => {
    const result = validateRegisterInput({
      fullName: 'Usuario Demo',
      email: 'demo@quill.local',
      password: 'Demo123456!',
      username: 'usuario-demo',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza nombre incompleto', () => {
    const result = validateRegisterInput({
      fullName: 'A',
      email: 'demo@quill.local',
      password: 'Demo123456!',
    });

    expect(result.success).toBe(false);
  });
});
