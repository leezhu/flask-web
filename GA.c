#include<stdio.h>
#include<stdlib.h>
#include<time.h>

//数据定义
#define Cmax 100	//最大值
#define Cmin 0 

#define LENGHT1 3 //	染色体长度
#define LENGHT2	3

#define CHROMLENGHT LENGHT1+LENGHT2
const int MaxGeneration = 100;//最大迭代次数
const int PopSize = 10;//样本大小
const double Pc = 0.6;//交叉概率
const double Pm = 0.001;//变异概率


//数据定义

struct Individual
{
	char chrom[CHROMLENGHT+1];
	double value;//目标值
	double fitness;//适应度
};

int generation;//进化次数
int bestIndex;//最好个体下标
int worstIndex;//最坏

Individual bestIndividual;
Individual worstIndividual;

//当前最好‘
Individual currentBest;
Individual population[PopSize];


/////函数定义

void generateInitialPopulation();//初始化
void generateNextPopulation();//产生下一个
void evalutePopulation();//进化人口
long decomdeChromosome(char *,int,int);//染色体剪枝
void calculateObjectValue();//计算对象值
void calculateFitnessValue();//适应度函数
void findBestAndWorstIndividual();
void performEvolution();//执行进化
void selectionOperator();//选择操作
void crossoverOperator();
void mutationOperator();
void outputTextReport();

///主函数

int main()
{
	generation = 0;
	generationInitialPopulation();
	evalutePopulation();

	while(generation<MaxGeneration)
	{
		generation++;
		generationNextPopulation();
		evalutePopulation();
		performEvolution();
		outputTextReport();
	}

	return 0;
}

///////
////第一代样本,初始化10个样本

void generateInitialPopulation()
{
	int i,j;
	srand((unsigned)time(NULL));

	for (i = 0;i<PopSize;i++)
	{
		for(j = 0;j<CHROMLENGH;j++)
			population[i].chrom[j] = ((rand()%10)<5)?'0':'1';
		population[i].chrom[CHROMLENGTH]='\0';//最后一个标志位
	}
}

//产生下一个样本
void generateNextPopulation()
{
	selectionOperator();
	crossoverOperator();
	mutationOperator();
}
void evalutePopulation();//进化人口
long decomdeChromosome(char *,int,int);//染色体剪枝
void calculateObjectValue();//计算对象值
void calculateFitnessValue();//适应度函数
void findBestAndWorstIndividual();
void performEvolution();//执行进化
void selectionOperator();//选择操作

//交叉算子
void crossoverOperator()
{
	int i,j;
	int index[PopSize];
	int point,temp;
	double p;
	char ch;

	for (i = 0;i<PopSize;i++)
		index[i]=i;

	for (i = 0;i<PopSize;i++)	//每一个全部打乱，实现交叉
	{
		point = rand()%(PopSize-i);
		temp = index[i];
		index[i] = index[point+i];
		index[point+i] = temp;
	}

	for (i = 0;i<PopSize-1;i+=2)
	{
		p = rand()%1000/1000.0;

		if(p<Pc)
		{
			point = rand()%(CHROMLENGTH-1)+1;//随机找出交叉点，然后实现两组样本的交叉
			for (j = point;j<CHROMLENGTH;j++)
			{
				ch=population[index[i]].chrom[j];
				population[index[i]].chrom[j] = population[index[i]+1].chrom[j];
				population[index[i]+1].chrom[j] = ch;
			}
		}
	}
}

//变异算子
void mutationOperator()
{
	int i,j;
	double p;

	for (i =0;i<PopSize;i++)
	{
		for (j = 0;j<CHROMLENGTH;j++)
		{
			p = rand()%1000/1000.0;
			if (p <Pm)
				population[i].chrom[j]=(population[i].chrom[j]=='0')?'1':'0';//如果小于随机变异概率就改变
		}
	}

}
void outputTextReport();


