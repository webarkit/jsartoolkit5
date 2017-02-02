/*
 *  thread_sub.c
 *  ARToolKit5
 *
 *  Implements a basic client-worker threading system.
 *
 *  ARToolKit is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  ARToolKit is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with ARToolKit.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  As a special exception, the copyright holders of this library give you
 *  permission to link this library with independent modules to produce an
 *  executable, regardless of the license terms of these independent modules, and to
 *  copy and distribute the resulting executable under terms of your choice,
 *  provided that you also meet, for each linked independent module, the terms and
 *  conditions of the license of that module. An independent module is a module
 *  which is neither derived from nor based on this library. If you modify this
 *  library, you may extend this exception to your version of the library, but you
 *  are not obligated to do so. If you do not wish to do so, delete this exception
 *  statement from your version.
 *
 *  Copyright 2015 Daqri, LLC.
 *  Copyright 2007-2015 ARToolworks, Inc.
 *
 *  Author(s): Hirokazu Kato, Philip Lamb
 *
 */
/*
    thread_sub.c, thread_sub.h

    Written by Hirokazu Kato
    kato@is.naist.jp   Apr.24 2007
 */

/*
 Mock everything here, because there's no threads in Javascript
*/


// stderr: warning: unresolved symbol: threadEndSignal
// warning: unresolved symbol: threadInit
// warning: unresolved symbol: threadStartWait
// warning: unresolved symbol: threadGetArg
// warning: unresolved symbol: threadGetID
// warning: unresolved symbol: threadGetCPU

#include <AR/ar.h>
#include <stdio.h>
#include <stdlib.h>
#include <thread_sub.h>


//
// Worker-side.
//

int threadStartWait( THREAD_HANDLE_T *flag )
{
    return 0;
}

int threadEndSignal( THREAD_HANDLE_T *flag )
{
    return 0;
}

int threadGetCPU(void)
{
    return 1;
}

THREAD_HANDLE_T *threadInit( int ID, void *arg, void *(*start_routine)(THREAD_HANDLE_T*) )
{
    return NULL;
}

int threadGetID( THREAD_HANDLE_T *flag )
{
    return 0;
}

void *threadGetArg( THREAD_HANDLE_T *flag )
{
    return 0;
}

int threadWaitQuit( THREAD_HANDLE_T *flag )
{
	return 0;
}

// struct _THREAD_HANDLE_T {
//     int             ID;
//     int             startF; // 0 = no request pending, 1 = start please, 2 = quit please.
//     int             endF;   // 0 = worker not started or worker running, 1 = worker completed, 2 = worker will quit (exit).
//     int             busyF;  // 0 = worker not started or worker ended, 1 = worker busy.
//     //pthread_t       thread;
//     pthread_mutex_t mut;
//     pthread_cond_t  cond1; // Signals from client that startF has changed.
//     pthread_cond_t  cond2; // Signals from worker that endF has changed.
//     void           *arg;
// };



int threadFree( THREAD_HANDLE_T **flag )
{
    return 0;
}

// int threadStartSignal( THREAD_HANDLE_T *flag )
// {
//     pthread_mutex_lock(&(flag->mut));
//     flag->startF = 1;
//     pthread_cond_signal(&(flag->cond1));
//     pthread_mutex_unlock(&(flag->mut));
//     return 0;
// }

// int threadGetStatus( THREAD_HANDLE_T *flag )
// {
//     int  endFlag;
//     pthread_mutex_lock(&(flag->mut));
//     endFlag = flag->endF;
//     pthread_mutex_unlock(&(flag->mut));

//     return endFlag;
// }

// int threadGetBusyStatus( THREAD_HANDLE_T *flag )
// {
//     int  busyFlag;
//     pthread_mutex_lock(&(flag->mut));
//     busyFlag = flag->busyF;
//     pthread_mutex_unlock(&(flag->mut));

//     return busyFlag;
// }

// int threadEndWait( THREAD_HANDLE_T *flag )
// {
//     pthread_mutex_lock(&(flag->mut));
//     while (flag->endF == 0) {
//         pthread_cond_wait(&(flag->cond2), &(flag->mut));
//     }
//     flag->endF = 0;
//     pthread_mutex_unlock(&(flag->mut));
//     return 0;
// }




