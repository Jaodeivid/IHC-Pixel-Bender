export const SOLUCIONES_DEMOSTRACION = {
  '4A': {
    python: {
      nombre: 'Python 3',
      prism: 'python',
      codigo: [
        'w = int(input())',
        '',
        'if w > 2 and w % 2 == 0:',
        '    print("YES")',
        'else:',
        '    print("NO")'
      ].join('\n')
    },
    cpp: {
      nombre: 'C++17',
      prism: 'cpp',
      codigo: [
        '#include <iostream>',
        'using namespace std;',
        '',
        'int main() {',
        '    int w;',
        '    cin >> w;',
        '',
        '    if (w > 2 && w % 2 == 0) {',
        '        cout << "YES" << endl;',
        '    } else {',
        '        cout << "NO" << endl;',
        '    }',
        '',
        '    return 0;',
        '}'
      ].join('\n')
    },
    java: {
      nombre: 'Java 17',
      prism: 'java',
      codigo: [
        'import java.util.Scanner;',
        '',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        Scanner sc = new Scanner(System.in);',
        '        int w = sc.nextInt();',
        '',
        '        if (w > 2 && w % 2 == 0) {',
        '            System.out.println("YES");',
        '        } else {',
        '            System.out.println("NO");',
        '        }',
        '',
        '        sc.close();',
        '    }',
        '}'
      ].join('\n')
    }
  }
}

export function obtenerSolucionesDemostracion(codigo) {
  return SOLUCIONES_DEMOSTRACION[codigo] ?? null
}
