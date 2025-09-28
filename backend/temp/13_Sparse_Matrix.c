// Implementing Sparse Matrix using 3-tuple Representation
#include <stdio.h>
#include <stdlib.h>

// // Global Variables
// int **sparse;
// int **matrix;

// Function to input a dynamically allocated matrix
void inputMatrix(int rowSIZE, int colSIZE, int **matrix) {
    printf("Enter elements of the matrix (%dx%d):\n", rowSIZE, colSIZE);
    for(int i = 0; i < rowSIZE; i++) {
        for(int j = 0; j < colSIZE; j++) {
            printf("matrix[%d][%d]: ", i, j);
            scanf("%d", &matrix[i][j]);
        }
    }
}

// Function to print a dynamically allocated matrix
void printMatrix(int rowSIZE, int colSIZE, int **matrix) {
    printf("Matrix is:\n");
    for(int i = 0; i < rowSIZE; i++) {
        for(int j = 0; j < colSIZE; j++) {
            printf("%4d ", matrix[i][j]);
        }
        printf("\n");
    }
}

// Function to create a Sparse Matrix
void toSparseMatrix(int rowSIZE, int colSIZE, int **matrix){
    int nonZeros = 0;

    for(int i=0; i<rowSIZE; i++){
        for(int j=0; j<colSIZE; j++){
            if(matrix[i][j] != 0){
                nonZeros++;
            }
        }
    }

    // Allocating Memory for Sparse Matrix
    int **sparse = (int **)malloc((nonZeros+1) * sizeof(int *));
    for(int i=0; i<nonZeros+1; i++){
        sparse[i] = (int *)malloc(3 * sizeof(int));
    }

    // Storing dimentions and no. of nonZeros in First row
    sparse[0][0] = rowSIZE;
    sparse[0][1] = colSIZE;
    sparse[0][2] = nonZeros;

    // Storing Values in Sparse Matrix
    int k=1; // k is index 1 of sparse array as 0th index contains data of og matrix
    for(int i=0; i<rowSIZE; i++){
        for(int j=0; j<colSIZE; j++){
            if(matrix[i][j] != 0){
                sparse[k][0] = i;
                sparse[k][1] = j;
                sparse[k][2] = matrix[i][j];
                k++;
            }
        }
    }
    printf("Sparsed ");
    printMatrix(nonZeros+1, 3, sparse);

    
}

// Coverting sparse to normal matrix
void toNormalMatrix(int rowCount, int **sparse){
    int rowSIZE = sparse[0][0];
    int colSIZE = sparse[0][1];

    // Dynamically allocate 2D array
    int **matrix = (int **)malloc(rowSIZE * sizeof(int *));
    for(int i = 0; i < rowSIZE; i++) {
        matrix[i] = (int *)malloc(colSIZE * sizeof(int));
    }

    // Initialising Matix to 0
    for(int i=0; i<rowSIZE; i++){
        for(int j=0; j<colSIZE; j++){
            matrix[i][j] = 0;
        }
    }

    // Fetching and Placing non-zero values
    for(int i=1; i<rowCount+1; i++){
        matrix[sparse[i][0]][sparse[i][1]] = sparse[i][2];
    }

    printMatrix(rowSIZE, colSIZE, matrix);
    
    
}
// Main Driver Function
int main() {
    int rowSIZE, colSIZE;
    int choice;
    printf("\nNormal to Sparse Matrix (1)\n");
    printf("Sparse to Normal Matrix (2)\n");
    printf("Enter Choice: ");
    scanf("%d", &choice);

    if(choice == 1){
        printf("Enter Number of Rows: ");
        scanf("%d", &rowSIZE);

        printf("Enter Number of Columns: ");
        scanf("%d", &colSIZE);

        // Dynamically allocate 2D array
        int **matrix = (int **)malloc(rowSIZE * sizeof(int *));
        for(int i = 0; i < rowSIZE; i++) {
            matrix[i] = (int *)malloc(colSIZE * sizeof(int));
        }

        inputMatrix(rowSIZE, colSIZE, matrix);
        printMatrix(rowSIZE, colSIZE, matrix);
        toSparseMatrix(rowSIZE, colSIZE, matrix);

        // Free allocated memory
        for(int i = 0; i < rowSIZE; i++) {
            free(matrix[i]);
        }
        free(matrix);
    }
    else if(choice == 2){
        int nonZero;
        printf("\nEnter Number of non-zero values: ");
        scanf("%d", &nonZero);

        // Dynamically allocate 2D array
        int **sparse = (int **)malloc((nonZero+1) * sizeof(int *));
        for(int i = 0; i < nonZero+1; i++) {
            sparse[i] = (int *)malloc(3 * sizeof(int));
        }

        inputMatrix(nonZero+1, 3, sparse);
        toNormalMatrix(nonZero, sparse);

        for(int i = 0; i < nonZero+1; i++) {
            free(sparse[i]);
        }
        free(sparse);

    }
    else{
        printf("\nINVALID INPUT\n");
    }

    
    return 0;
}
