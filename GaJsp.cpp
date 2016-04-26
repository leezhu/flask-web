#include<iostream>
#include<time.h>
#include<vector>
#include <fstream>
#include<string>
#include<algorithm>
using namespace std;
#define N 10
#define MAXN 100
//sequence metrix
int worK_sequence[10][10] = { { 3, 1, 2, 4, 6, 5, 7, 8, 9, 10 },
{ 2, 3, 5, 6, 7, 8, 1, 4, 10, 9 },
{ 3, 4, 7, 8, 2, 5, 6, 10, 9, 1 },
{ 7, 8, 2, 1, 3, 4, 10, 9, 5, 6 },
{ 3, 7, 8, 2, 5, 10, 9, 6, 1, 4 },
{ 2, 4, 7, 9, 10, 6, 8, 1, 5, 3 },
{ 5, 6, 3, 10, 9, 4, 7, 8, 2, 1 },
{ 4, 9, 10, 6, 3, 5, 1, 2, 8, 7 },
{ 5, 10, 9, 6, 4, 1, 2, 3, 7, 8 },
{ 6, 2, 1, 5, 8, 3, 4, 7, 10, 9 } };
//each sequnece working-time
int work_time[10][10] = { { 5, 20, 25, 35, 15, 35, 30, 35, 35, 20 },
{ 40, 30, 50, 40, 45, 20, 30, 15, 30, 35 },
{ 20, 20, 40, 45, 5, 40, 15, 35, 50, 10 },
{ 30, 30, 25, 25, 40, 50, 35, 15, 35, 50 },
{ 40, 15, 30, 20, 5, 5, 35, 35, 35, 30, },
{ 10, 10, 40, 50, 20, 10, 35, 40, 35, 30 },
{ 35, 30, 35, 30, 10, 45, 45, 15, 15, 45 },
{ 20, 30, 50, 20, 20, 35, 30, 50, 20, 30 },
{ 10, 35, 20, 30, 30, 30, 45, 30, 45, 50 },
{ 40, 10, 30, 35, 40, 15, 35, 20, 40, 20 } };

const int work_piece = N;
const int device = N;
const int population = 5;
const int generation = 100;
const int mutation_pro = 0.1;//mutation probability
const int cross_pro = 0.5;	//cross probability

//三维数组存染色体
int chrom[population][N][N];




//每个染色体最大完成时间
int fastCompleTime[5];

//最优的完成时间,和最优的染色体
int bestMachineSequence[N][N];
int bestChrom[N][N];
int bestIndex;
int best_time = 9999;

//最差的染色体标记
int worstChromIndex;

ofstream myfout("result.txt", ios::trunc);


//transform the sequence to adapt from 0
void transform_sequence()
{
	for (int i = 0; i<N; i++)
		for (int j = 0; j<N; j++)
			worK_sequence[i][j] = worK_sequence[i][j] - 1;
}

//swap
void myswap(int &a, int &b)
{
	int temp;
	temp = a;
	a = b;
	b = temp;
}
//void swap
//随机改变序列
void changeSequence(int chrom[N][N])
{

	//for (int ix = 0; ix < N;ix++)
	//{
	int n = 100;
	//交换10次
	while (n--)
	{

		int pos_1 = rand() % 99;
		int pos_2 = rand() % 99;

		///cout << "pos1=: " << pos_1 << " " << "pos_2: " << pos_2 << endl;
		myswap(chrom[pos_1 / 10][pos_1 % 10], chrom[pos_2 / 10][pos_2 % 10]);

	}


	//}
}
//intial population
void initial_population()
{

	srand(time(NULL));//时间种子不能放在循环里面
	transform_sequence();
	memset(fastCompleTime, 0, sizeof(fastCompleTime));//初始化最大完成时间
	for (int ix = 0; ix < population; ix++)
	{
		for (int i = 0; i < N; i++)
		{
			for (int j = 0; j < N; j++)
			{

				chrom[ix][i][j] = j;

			}
		}
	}
	for (int ix = 0; ix < population; ix++)
	{
		changeSequence(chrom[ix]);
	}

	//for (int i = 2; i < 4; i++)
	//{
	//	cout << i << "-------------------------" << endl;
	//	for (int ix = 0; ix < N; ix++)
	//	{
	//		for (int iy = 0; iy < N; iy++)
	//		{
	//		cout << chrom[i][ix][iy] << " ";
	//		}
	//	//cout << endl;
	//	}
	//	cout << endl;
	//}

}

void caculate_time()
{

	int machinePos[N];
	int sequenceAdd[N];
	int machineTime[N][N];
	int jobPos[N][N];
	//初始化



	//cout<< " Workpiece   machineNum   machinePos[machineNum] "<< endl;
	//查找工件,更新机器时间表

	for (int pop = 0; pop < population; pop++)
	{
		memset(machineTime, 0, sizeof(machineTime));
		memset(machinePos, 0, sizeof(machinePos));
		memset(sequenceAdd, 0, sizeof(sequenceAdd));
		memset(jobPos, 0, sizeof(jobPos));
		for (int ix = 0; ix < N; ix++)
		{
			for (int iy = 0; iy < N; iy++)
			{
				int pos = chrom[pop][ix][iy];
				//	cout << pos;
				int machineNum = worK_sequence[pos][sequenceAdd[pos]];


				//cout << machineNum<<" ";
				//判断机器上个工件的完成时间和工件上个工序的完成时间大小



				if (0 == machinePos[machineNum])
				{
					if (0 == sequenceAdd[pos])
					{
						machineTime[machineNum][machinePos[machineNum]] = work_time[pos][sequenceAdd[pos]];//说明是机器的第一个工件，工件的第一个工序
					}
					else
					{
						int wokrPieceFrontNum = worK_sequence[pos][sequenceAdd[pos] - 1];
						//machinepos已经++，所以需要找出来上一工序的完成时间，进行查找

						int index = 0;
						for (int i = 0; i < machinePos[machineNum];i++)
						{
							if (jobPos[machineNum][i]==wokrPieceFrontNum)
							{
								index = i;
								break;
							}
						}

						machineTime[machineNum][machinePos[machineNum]] = work_time[pos][sequenceAdd[pos]] +
							machineTime[wokrPieceFrontNum][index];//说明是机器的第一个，但不是工件的第一个工序，
					}
				}
				else if (0 == sequenceAdd[pos] && (0 != machinePos[machineNum]))
				{
					machineTime[machineNum][machinePos[machineNum]] = work_time[pos][sequenceAdd[pos]] +
						machineTime[machineNum][machinePos[machineNum] - 1];//说明是工件的第一个工序，只要算从机器的前一个工序接起来
				}
				else
				{
					int temp1 = machineTime[machineNum][machinePos[machineNum] - 1];//机器的上一个工件
					int wokrPieceFrontNum = worK_sequence[pos][sequenceAdd[pos] - 1];
					int temp2 = machineTime[wokrPieceFrontNum][machinePos[wokrPieceFrontNum]];//工件的上一个工序

					if (temp1 > temp2)//如果机上一个工件完成时间比工件上一个工序完成时间小
					{
						machineTime[machineNum][machinePos[machineNum]] = work_time[pos][sequenceAdd[pos]] +
							machineTime[machineNum][machinePos[machineNum] - 1];
					}
					else
						machineTime[machineNum][machinePos[machineNum]] = work_time[pos][sequenceAdd[pos]] +
						machineTime[wokrPieceFrontNum][machinePos[wokrPieceFrontNum]];
					// m++;

				}
				jobPos[machineNum][machinePos[machineNum]] = pos;
				sequenceAdd[pos] = sequenceAdd[pos] +1 ;
				machinePos[machineNum] = machinePos[machineNum] +1 ;
				//cout << "job"<<pos << machineNum << "            " << machinePos[machineNum] << endl;



			}
			//cout << endl;
		}

		/*cout << "---------------------------------" << endl;
		for (int ix = 0; ix < N; ix++)
		{
		for (int iy = 0; iy < N; iy++)
		{
		cout << "job" << jobPos[ix][iy] << " " << machineTime[ix][iy] << " ";
		}
		cout << endl;
		}*/


		//更新最大完成时间。
		for (int ix = 0; ix < N; ix++)
		{
			if (machineTime[ix][9]>fastCompleTime[pop])
			{
				fastCompleTime[pop] = machineTime[ix][9];
			}
		}

		//记录一代中最优的机器工件工序
		if (fastCompleTime[pop]<best_time)
		{
			best_time = fastCompleTime[pop];
			bestIndex = pop;
			for (int i = 0; i < N; i++)
			{
				for (int j = 0; j < N; j++)
				{
					bestMachineSequence[i][j] = jobPos[i][j];
					bestChrom[i][j] = chrom[pop][i][j];
				}
			}
		}


		

	}

	//打印最大完成时间
	/*for (int ix = 0; ix < population; ix++)
	{
		cout << " fastCompleTime=" << fastCompleTime[ix] << " \n";
	}*/
	//cout << "m=: " << m;
	/*for (int ix = 0; ix < N; ix++)
	{
	for (int iy = 0; iy < N; iy++)
	{
	cout << machineTime[ix][iy] << " ";
	}
	cout << endl;
	}
	*/
}

//only mutation,相邻位置变异
void mutation_population()
{
	srand(time(NULL));

	double mutPro = rand() % 1000 / 1000.0;
	if (mutPro>mutation_pro)
	{
		for (int ix = 0; ix < population; ix++)
		{
			changeSequence(chrom[ix]);
		}
	}
	

}

//工序不变点交叉
void cross_population()
{

	srand(time(NULL));
	int k = population;
	int child[N][N];
	memset(child, 0, sizeof(child));

	//将五个染色体进行随机交叉五次
	while (k--)
	{
		//选取随机交叉点
		//根据交叉概率来进行选择
		double pro = rand() % 1000 / 1000.0;
		if (pro>cross_pro)
		{
			int fathercrossPos = rand() % (population - 1);//染色体的随机交叉位置
			int montercrossPos = rand() % (population - 1);
			while (fathercrossPos == montercrossPos)
			{
				montercrossPos = rand() % (population - 1);
			}

			//选择工序不变点，然后用母系染色体的除不变点外的进行补全

			int chromCrossPos = rand() % (N - 1);
			int m = 0;
			int n = 0;

			while (m < 100)
			{
				if (chrom[montercrossPos][m / N][m%N] == chromCrossPos)
				{
					m++;
					continue;
				}
				else if (chrom[fathercrossPos][n / N][n%N] == chromCrossPos)
				{
					n++;
					continue;
				}


				chrom[fathercrossPos][n / N][n%N] = chrom[montercrossPos][m / N][m%N];
				m++;
				n++;

			}

		}
		
		//cout << "changg==============" << endl;
		//for (int i = 0; i < N;i++)
		//{
		//	for (int j = 0; j < N;j++)
		//	{
		//		cout << chrom[2][i][j] << " ";
		//	}
		//	//cout << endl;
		//}

		//}


	}

}

//得到最优解和最小完成时间，并剔除最差的染色体
void updateBest()
{



	//进行轮盘赌，将最坏的剔除

	double chromPro[population];//每个染色体的目标值倒数进行累加
	int sum = 0;				//总的目标值
	int chromHit[population];	//每个染色体命中的次数

	memset(chromPro, 0.0, sizeof(chromPro));
	memset(chromHit, 0, sizeof(chromHit));

	for (int i = 0; i < N; i++)
	{
		sum += fastCompleTime[i];
	}

	chromPro[0] = fastCompleTime[0]*1.0 / sum;

	for (int i = 1; i < N; i++)
	{
		chromPro[i] = chromPro[i - 1] + fastCompleTime[i]*1.0/sum;
	}

	double pro = rand() % 1000 / 1000.0;

	//轮盘赌
	if (pro<chromPro[0])
	{
		chromHit[0]++;
	}
	else if (pro<chromPro[1])
	{
		chromHit[1]++;
	}
	else if (pro<chromPro[2])
	{
		chromHit[2]++;
	}
	else if (pro<chromPro[3])
	{
		chromHit[3]++;
	}
	else
	{
		chromHit[4]++;
	}


	//找出最小者
	int min = 99;
	int minIndex;
	for (int i = 0; i < 5;i++)
	{
		if (chromHit[i]<min)
		{
			min = chromHit[i];
			minIndex = i;
		}
	}
	
	//用最优的来替换最差的

	for (int i = 0; i < N;i++)
	{
		for (int j = 0; j < N;j++)
		{
			chrom[minIndex][i][j] = bestChrom[i][j];
		}
	}
	
}


void evolution()
{

	mutation_population();
	cross_population();
	caculate_time();
	updateBest();



}

int main()
{
	int generation = 0;

	initial_population();
	caculate_time();

	while (generation < 100)
	{
		generation++;
		evolution();
		myfout << "The " << generation << " generation:" << endl;
		myfout << "the Min Operation time is:" << best_time << endl;
		for (int i = 0; i < N; i++)
		{
			myfout << "Machine " << i + 1 << ": ";
			for (int j = 0; j < N; j++)
				myfout <<"Job_"<< bestMachineSequence[i][j]+1 << " / ";
			myfout << endl;
		}

	}
	system("pause");
	
	return 0;
}