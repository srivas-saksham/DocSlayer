// C Program for Matrix Operations Using Switch-Case
#include <stdio.h>

#define SIZE 3  // Define matrix size

void inputMatrix(int matrix[SIZE][SIZE], char name) {
    printf("Enter elements of matrix %c (%dx%d):\n", name, SIZE, SIZE);
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf("%c[%d][%d]: ", name, i, j);
            scanf("%d", &matrix[i][j]);
        }
    }
}

void printMatrix(int matrix[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf("%d\t", matrix[i][j]);
        }
        printf("\n");
    }
}

void addMatrices(int A[SIZE][SIZE], int B[SIZE][SIZE], int result[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
}

void subtractMatrices(int A[SIZE][SIZE], int B[SIZE][SIZE], int result[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
}

void multiplyMatrices(int A[SIZE][SIZE], int B[SIZE][SIZE], int result[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            result[i][j] = 0;
            for (int k = 0; k < SIZE; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}

void transposeMatrix(int A[SIZE][SIZE], int result[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            result[j][i] = A[i][j];
        }
    }
}

int main() {
    int A[SIZE][SIZE], B[SIZE][SIZE], result[SIZE][SIZE];
    int choice;

    // Input matrices
    inputMatrix(A, 'A');
    inputMatrix(B, 'B');

    // Menu
    printf("\nChoose operation:\n");
    printf("1. Addition\n2. Subtraction\n3. Multiplication\n4. Transpose (of A)\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1:
            addMatrices(A, B, result);
            printf("\nResultant Matrix after Addition:\n");
            printMatrix(result);
            break;
        case 2:
            subtractMatrices(A, B, result);
            printf("\nResultant Matrix after Subtraction:\n");
            printMatrix(result);
            break;
        case 3:
            multiplyMatrices(A, B, result);
            printf("\nResultant Matrix after Multiplication:\n");
            printMatrix(result);
            break;
        case 4:
            transposeMatrix(A, result);
            printf("\nTranspose of Matrix A:\n");
            printMatrix(result);
            break;
        default:
            printf("\nInvalid choice!\n");
    }

    return 0;
}
